const Cart= require("../../models/cart.model")
module.exports.cartID= async (req,res,next)=> {
   if(!req.cookies.cartID) {
      const cart = new Cart();
      await cart.save();
    
    const expiresTime =1000*60*60*24*365;

     res.cookie("cartID",cart.id, {expires: new Date(Date.now()+ expiresTime)});      
   }else{
       const cart= await Cart.findOne({
         _id:req.cookies.cartID
       })
       cart.totalQuantity= cart.products.reduce((sum,item)=>sum+item.quantity,0);
       res.locals.miniCart=cart;
   }


   next();
}