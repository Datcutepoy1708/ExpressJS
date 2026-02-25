const Blog = require("../../models/blog.model");
const BlogCategory = require("../../models/blog-category.model");
const blogsCategoryHelper = require("../../helpers/blog-category");
module.exports.index = async (req, res) => {
    const blogs = await Blog.find({
        status: "active",
        deleted: false
    }).sort({ position: "desc" })
    res.render("client/pages/blogs/index", {
        pageTitle: "Danh sách bài viết",
        blogs: blogs
    })
}

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugBlog,
            status: "active"
        };
        const blog = await Blog.findOne(find);

        if (blog.blogs_category_id) {
            const category = await BlogCategory.findOne({
                _id: blog.blogs_category_id,
                status: "active",
                deleted: false
            })
            blog.category = category;
        }

        res.render("client/pages/blogs/detail", {
            pageTitle: blog.title,
            blog:blog
        })
    } catch (error) {
        req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại")
        res.redirect(`/blogs`)
    }
}

module.exports.category = async (req, res) => {
    const category = await BlogCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })

    
   const listSubCategory=  await blogsCategoryHelper.getSubCategory(category.id);

   const listSubCategoryId= listSubCategory.map(item => item.id);

    const blogs = await Blog.find({
        blogs_category_id: {$in: [category.id,...listSubCategoryId]},
        deleted: false
    }).sort({ positon: "desc" });

    res.render("client/pages/blogs/index", {
        pageTitle: category.title,
        blogs:blogs
    })

}