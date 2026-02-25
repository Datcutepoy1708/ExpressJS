const dashboardRoutes = require("./dashboard.route");
const systemConfig = require("../../config/system");
const productRoutes = require("./product.route");
const roleRoutes = require("./role.route");
const authRoutes = require("./auth.route");
const accountRoutes = require("./account.route");
const blogCategoryRoutes = require("./blog-category.route");
const authMiddleware = require("../../middlewares/admin/auth.middleware");
const myAccountRoutes=require("./my-account.route");
const blogRoutes=require("./blog.route");
const orderRoutes=require("./order.route");
const settingRoutes=require("./setting.route");
const customerRoutes=require("./customer.route")
const productCategoryRoutes = require("./product-category.route")
module.exports = (app) => {

    const PATH_ADMIN = systemConfig.prefixAdmin
    
    app.use(PATH_ADMIN +"/blog",authMiddleware.requireAuth,blogRoutes);
    app.use(PATH_ADMIN + "/dashboard", authMiddleware.requireAuth, dashboardRoutes);
    app.use(PATH_ADMIN + "/products", authMiddleware.requireAuth, productRoutes);
    app.use(PATH_ADMIN + "/product-category", authMiddleware.requireAuth, productCategoryRoutes);
    app.use(PATH_ADMIN+"/blog-category",authMiddleware.requireAuth,blogCategoryRoutes);
    app.use(PATH_ADMIN + "/roles", authMiddleware.requireAuth, roleRoutes);
    app.use(PATH_ADMIN+"/customer",authMiddleware.requireAuth,customerRoutes);
    app.use(PATH_ADMIN+"/order",authMiddleware.requireAuth,orderRoutes);
    app.use(PATH_ADMIN + "/auth", authRoutes);
    app.use(PATH_ADMIN+"/settings",authMiddleware.requireAuth,settingRoutes);
    app.use(PATH_ADMIN+"/my-account",authMiddleware.requireAuth,myAccountRoutes);
    app.use(PATH_ADMIN + "/accounts", authMiddleware.requireAuth, accountRoutes);
}

