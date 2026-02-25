const Cart = require("../../models/cart.model");
const Product = require("../../models/product.model");
const Order= require("../../models/orders.model");
const productsHelper = require("../../helpers/product");

module.exports.index = async (req, res) => {
    const cartID = req.cookies.cartID;
    const cart = await Cart.findOne({
        _id: cartID
    })
    if (cart.products.length > 0) {
        for (const item of cart.products) {
            const productID = item.product_id;
            const productInfo = await Product.findOne({
                _id: productID,
            })
            productInfo.priceNew = productsHelper.priceNewProduct(productInfo)
            item.productInfo = productInfo;
            item.totalPrice = item.quantity * productInfo.priceNew
        }
    }

    cart.totalPrice = cart.products.reduce((sum, item) => sum + item.totalPrice, 0)
    res.render("client/pages/checkout/index", {
        pageTitle: "Đặt hàng",
        cartDetail: cart
    })
}


// [POST] /checkout/order
module.exports.order = async(req,res)=> {
   const cartID= req.cookies.cartID;
   const userInfo= req.body;
   const cart= await Cart.findOne({
    _id:cartID
   })
   let products = [];
   for(const product of cart.products){
      const objectProduct = {
        product_id: product.product_id,
        price:0,
        discountPercentage:0,
        quantity: product.quantity
      };
      const productInfo= await Product.findOne({
        _id: product.product_id
      });
      objectProduct.price=productInfo.price;
      objectProduct.discountPercentage= productInfo.discountPercentage;
      products.push(objectProduct)
   }
   const objectOrder  = {
    cart_id:cartID,
    userInfo: userInfo,
    products: products
   };
   const order= new Order(objectOrder);
   await order.save();
   await Cart.updateOne({
     _id: cartID
   },{
    products: []
   })
   res.redirect(`/checkout/success/${order.id}`);
}


module.exports.success= async(req,res)=> {
    const order= await Order.findOne({
        _id:req.params.orderID
    })
    for(const product of order.products) {
        const productInfo= await Product.findOne({
            _id: product.product_id
        }).select("title thumbnail price discountPercentage")
        product.productInfo= productInfo
        product.priceNew= productsHelper.priceNewProduct(productInfo);
        product.totalPrice= product.priceNew * product.quantity
        
    } 
    order.totalPrice = order.products.reduce((sum,item)=>sum+item.totalPrice,0)
    res.render("client/pages/checkout/success",{
        pageTitle: "Đặt hàng thành công",
        order:order
    })
}