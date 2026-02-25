const productRoutes= require("./product.route.js");
const homeRoutes= require("./home.route.js");
const blogRoute=require("./blog.route.js");
const blogMiddleware= require("../../middlewares/client/blog.middleware.js");
const categoryMiddleware= require("../../middlewares/client/category.middleware.js");
const searchRoute=require("./search.route.js");
const cartRoute=require("./cart.route.js");
const checkoutRoute=require("./checkout.route.js");
const userRoute=require("./user.route.js");
const usersRoute=require("./users.route.js");
const chatRoute=require("./chat.route.js");
const roomChatRoute=require("./rooms-chat.route.js");
const authMiddleware=require("../../middlewares/client/auth.middleware.js");
const settingMiddleware=require("../../middlewares/client/setting.middleware.js");
const cartMiddleware=require("../../middlewares/client/cart.middleware.js");
const userMiddleware= require("../../middlewares/client/user.middleware.js");
module.exports = (app) => {
    
    app.use(cartMiddleware.cartID);
    app.use(userMiddleware.infoUser);
    app.use(categoryMiddleware.category);
    app.use(settingMiddleware.settingGeneral);
    app.use(blogMiddleware.category);
    app.use("/",homeRoutes);
    app.use("/cart",cartRoute);
    app.use("/user",userRoute);
    app.use("/users",authMiddleware.requireAuth,usersRoute);
    app.use("/blogs",blogRoute);
    app.use("/checkout",checkoutRoute);
    app.use("/rooms-chat",authMiddleware.requireAuth,roomChatRoute);
    app.use("/chat",authMiddleware.requireAuth,chatRoute);
    app.use("/search",searchRoute);
   
    // app.get('/products', (req, res) => {
    //     res.render("client/pages/products/index");
    // })
    app.use("/products",productRoutes);
}