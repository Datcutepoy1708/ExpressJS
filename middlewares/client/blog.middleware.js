const BlogCategory= require("../../models/blog-category.model");
const createTreeHelper=require("../../helpers/createTree");
module.exports.category = async (req, res, next) => {
    const blogCategory = await BlogCategory.find({
        deleted: false
    });
    const newBlogCategory = createTreeHelper.tree(blogCategory)
    res.locals.layoutBlogsCategory = newBlogCategory;
    next();
}