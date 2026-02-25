const Account = require("../../models/account.model");
const filterStatusHelpers = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");
const Blog = require("../../models/blog.model");
const BlogCategory= require("../../models/blog-category.model");
const searchHelpers = require("../../helpers/Search");
const systemConfig = require("../../config/system");
const createTreeHelpers=require("../../helpers/createTree");
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelpers(req.query);

    let find = {
        deleted: false
    };

    if (req.query.status) {
        find.status = req.query.status;
    }

    // Pagination
    const countBlogs = await Blog.countDocuments(find);

    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countBlogs
    )
    // End Pagination
    const objectSearch = searchHelpers(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex;
    }
    let sort = {};
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc";
    }
    const blogs = await Blog.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
    for (blogItem of blogs) {
        const user = await Account.findOne({
            _id: blogItem.createdBy.account_id
        });
        if (user) {
            blogItem.accountFullName = user.fullName
        }
        if (blogItem.editedBy && blogItem.editedBy.length > 0) {
            const lastEdit = blogItem.editedBy[blogItem.editedBy.length - 1];
            const editUser = await Account.findOne({
                _id: lastEdit.account_id
            })
            if (editUser) {
                blogItem.lastEditBy = editUser.fullName
                blogItem.lastEditedAt = lastEdit.editedAt
                blogItem.editedBy = blogItem.editedBy.length
            }
        }
    }

    res.render("admin/pages/blog/index", {
        pageTitle: "Danh sách bài viết",
        blogs: blogs,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}
module.exports.create = async (req, res) => {
    let find= {
        deleted: false
    }
    const category= await BlogCategory.find(find);
    const newCategory= createTreeHelpers.tree(category);
    res.render("admin/pages/blog/create", {
        pageTitle: "Thêm mới bài viết ",
        category: newCategory
    })
}
module.exports.createPost = async (req, res) => {
    if (!req.body.position || req.body.position === "") {
        const countBlogs = await Blog.countDocuments();
        req.body.position = countBlogs + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id
    }
    const blogs = new Blog(req.body);
    await blogs.save();
    res.redirect(`${systemConfig.prefixAdmin}/blog`);
}
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const blogs = await Blog.findOne(find);
        res.render("admin/pages/blog/detail", {
            pageTitle: "Chi tiết bài viết",
            blogs: blogs
        })
    } catch (error) {
        req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại");
        res.redirect(`${systemConfig.prefixAdmin}/blog`);
    }
}
module.exports.edit = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const category= await BlogCategory.find({
            deleted:false
        })
        const newCategory= createTreeHelpers.tree(category);
        const blogs = await Blog.findOne(find);
        res.render("admin/pages/blog/edit", {
            pageTitle: "Chỉnh sửa sản phẩm",
            blogs: blogs,
            category: newCategory
        })
    } catch (error) {
        req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại")
        res.redirect(`${systemConfig.prefixAdmin}/blog`)
    }
}
module.exports.editPatch = async (req, res) => {
    let find = {
        deleted: false
    }
    if (!req.body.position || req.body.position === "") {
        const countBLogs = await Blog.countDocuments();
        req.body.position = countBLogs+1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    if (req.file) {
        req.body.thumbnail = `/uploads/${req.file.filename}`
    }
    try {
        const editedBy = {
            account_id: res.locals.user.id,
            editedAt: new Date()
        }
        await Blog.updateOne({
            _id: req.params.id
        }, { ...req.body, $push: { editedBy: editedBy } })
    } catch (error) {
        req.flash("error", "Đã sửa thành công");
    }
    const referer = req.get('Referer') || '/admin/blog';
    res.redirect(referer);
}
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id },{deleted: true});
    await Blog.updateOne({ _id: id }, {
        deleted: true, deletedBy: {
            account_id: res.locals.user.id,
            deletedAt: new Date()
        }
    },);
    const referer = req.get('Referer') || '/admin/blog';
    res.redirect(referer);
}
module.exports.changeMulti = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    switch (type) {
        case "active":
            await Blog.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
            break
        case "inactive":
            await Blog.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
            break
        case "delete-all":
            await Blog.updateMany({
                _id: {
                    $in: ids
                }
            }, {
                deleted: true, deletedBy: {
                    account_id: res.locals.user.id,
                    deletedAt: new Date()
                }
            });
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await Blog.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } });
            }
        default:
            break;
    }
    const referer = req.get('Referer') || '/admin/blog';
    res.redirect(referer);
}
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await Blog.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })
    req.flash("success", "Cập nhật trạng thái thành công");
    const referer = req.get('Referer') || '/admin/blog';
    res.redirect(referer);
}