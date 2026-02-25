const filterStatusHelpers = require("../../helpers/filterStatus");
const BlogCategory = require("../../models/blog-category.model");
const createTreeHelpers = require("../../helpers/createTree");
const paginationHelper = require("../../helpers/pagination");
const searchHelpers = require("../../helpers/Search");
const systemConfig = require("../../config/system");
const Account = require("../../models/account.model");
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelpers(req.query);
    let find = {
        deleted: false
    };
    if (req.query.status) {
        find.status = req.query.status;
    }
    //Pagination
    const countBlogs = await BlogCategory.countDocuments(find);


    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countBlogs
    )
    //End Pagination
    //
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

    //
    const records = await BlogCategory.find(find).sort(sort);
    for (const record of records) {
        const user = await Account.findOne({
            _id: record.createdBy.account_id
        });
        if (user) {
            record.accountFullName = user.fullName
        }
        if (record.editedBy && record.editedBy.length > 0) {
            const lastEdit = record.editedBy[record.editedBy.length - 1];
            const editUser = await Account.findOne({
                _id: lastEdit.account_id
            })
            if (editUser) {
                record.lastEditBy = editUser.fullName
                record.lastEditedAt = lastEdit.editedAt
                record.editedBy = record.editedBy.length
            }
        }
    }
    const newRecords = createTreeHelpers.tree(records);



    res.render("admin/pages/blog-category/index", {
        pageTitle: "Danh mục bài viết",
        records: newRecords,
        filterStatus: filterStatus,
        keyword: objectSearch.keyword,
        pagination: objectPagination
    })
}
module.exports.create = async (req, res) => {

    let find = {
        deleted: false
    };
    const records = await BlogCategory.find(find);

    const newRecords = createTreeHelpers.tree(records);
    console.log(newRecords);
    res.render("admin/pages/blog-category/create", {
        pageTitle: "Tạo danh mục bài viết",
        records: newRecords,
    })
}

module.exports.createPost = async (req, res) => {
    if (!req.body.position || req.body.position === "") {
        const countBlogs = await BlogCategory.countDocuments();
        req.body.position = countBlogs + 1;
    } else {
        req.body.position = parseInt(req.body.position);
    }
    req.body.createdBy = {
        account_id: res.locals.user.id
    }

    const record = new BlogCategory(req.body);
    await record.save();
    res.redirect(`${systemConfig.prefixAdmin}/blog-category`);
}
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    // await Product.deleteOne({ _id: id },{deleted: true});
    await BlogCategory.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() },);
    const referer = req.get('Referer') || '/admin/blog-category';
    res.redirect(referer);
}
module.exports.detailCategory = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        };
        const data = await BlogCategory.findOne(find);
        const category = await BlogCategory.find({
            deleted: false
        })
        const newCategory = createTreeHelpers.tree(category);
        res.render("admin/pages/blog-category/detail", {
            pageTitle: "Thông tin danh mục",
            data: data,
            category: newCategory
        })
    } catch (error) {
        req.flash("error", " vui lòng load lại")
        res.redirect(`${systemConfig.prefixAdmin}/blog-category`)
    }
}
module.exports.changeMultiCategory = async (req, res) => {
    const type = req.body.type;
    const ids = req.body.ids.split(", ");
    switch (type) {
        case "active":
            await BlogCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
            break
        case "inactive":
            await BlogCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });
            req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
            break
        case "delete-all":
            await BlogCategory.updateMany({
                _id: {
                    $in: ids
                }
            }, { deleted: true, deletedAt: new Date() });
        case "change-position":
            for (const item of ids) {
                let [id, position] = item.split("-");
                position = parseInt(position);
                await BlogCategory.updateOne({ _id: id }, { position: position });
            }
        default:
            break;
    }
    const referer = req.get('Referer') || '/admin/blog-category';
    res.redirect(referer);
}
module.exports.changeStatusCategory = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;

    const updatedBy = {
        account_id: res.locals.user.id,
        updatedAt: new Date()
    }

    await BlogCategory.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })
    req.flash("success", "Cập nhật trạng thái thành công");
    const referer = req.get('Referer') || '/admin/blog-category';
    res.redirect(referer);
}

module.exports.editCategory = async (req, res) => {
    try {
        const id = req.params.id;

        const data = await BlogCategory.findOne({
            _id: id,
            deleted: false
        })

        const records = await BlogCategory.find({
            deleted: false
        })

        const newRecords = createTreeHelpers.tree(records);

        res.render("admin/pages/blog-category/edit", {
            pageTitle: "Chỉnh sửa danh mục bài viết",
            data: data,
            records: newRecords
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/blog-category`)
    }
}
module.exports.editPatchCategory = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  await BlogCategory.updateOne({ _id: id }, {...req.body, $push: {
    editedBy: {
      account_id: res.locals.user.id,
      editedAt: new Date()
    }
  }});
  const referer = req.get('Referer') || '/admin/blog-category';
  res.redirect(referer);
}