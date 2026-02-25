const Product=require("../../models/product.model");
const productHelper =require("../../helpers/product");
const { GridFSBucketReadStream } = require("mongodb");
// [GET] /
module.exports.index = async (req,res)=> {
   
// Lấy ra sản phẩm nổi bât
  const productsFeatured= await Product.find({
    featured: "1",
    deleted:false,
    status:"active"
  }).limit(6);
  const newProductFeatured= productHelper.priceNewProducts(productsFeatured);
// Lấy ra sản phẩm nổi bâkkt

// Hiển thị sản phẩm mới nhất
const productsNew= await Product.find({
  deleted:false,
  status:"active"
}).sort({position: "desc"}).limit(4);
const newProductsNew=productHelper.priceNewProducts(productsNew);
// Hiện ra sản phẩm mới nhất

    res.render("client/pages/home/index",{
        pageTittle: "Trang chủ",
        productsFeatured: newProductFeatured,
        productsNew:newProductsNew
    });
}
