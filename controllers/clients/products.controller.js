// [GET] /products
const ProductCategory = require("../../models/product-category.model");
const Product = require("../../models/product.model");
const productHelper = require("../../helpers/product");
const productsCategoryHelper= require("../../helpers/product-category");
module.exports.index = async (req, res) => {

    const product = await Product.find({
        status: "active",
        deleted: "false"
    }).sort({ positon: "desc" })

    const newProduct = productHelper.priceNewProducts(product);

    res.render("client/pages/products/index", {
        pageTitle: "Danh sách sản phẩm",
        products: newProduct
    });
}

// [GET] /product/:slug

module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            slug: req.params.slugProduct,
            status: "active"
        };
        const product = await Product.findOne(find);

        if(product.product_category_id){
            const category= await ProductCategory.findOne({
                _id: product.product_category_id,
                status:"active",
                deleted:false
            })
            product.category= category;
        }

        product.priceNew= productHelper.priceNewProduct(product);      

        res.render("client/pages/products/detail", {
            pageTitle: product.title,
            product: product
        })
    } catch (error) {
        req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại")
        res.redirect(`/products`)
    }
}

// [GET]  /product:slugCategory

module.exports.category = async (req, res) => {
    const category = await ProductCategory.findOne({
        slug: req.params.slugCategory,
        status: "active",
        deleted: false
    })

    
   const listSubCategory=  await productsCategoryHelper.getSubCategory(category.id);

   const listSubCategoryId= listSubCategory.map(item => item.id);

    const products = await Product.find({
        product_category_id: {$in: [category.id,...listSubCategoryId]},
        deleted: false
    }).sort({ positon: "desc" });

    const newProducts = productHelper.priceNewProducts(products);
    res.render("client/pages/products/index", {
        pageTitle: category.title,
        products: newProducts
    })

}