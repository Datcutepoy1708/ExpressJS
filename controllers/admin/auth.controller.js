// [GET] /admin/auth/login

const md5 = require("md5");
const Account = require("../../models/account.model");
const systemConfig = require("../../config/system");

module.exports.login = (req, res) => {
    if (req.cookies.token) {
        res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
    }
    else {
        res.render("admin/pages/auth/login", {
            pageTitle: "Trang đăng nhập"
        })
    }
}

// [POST] /admin/auth/login

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;

    const user = await Account.findOne({
        email: email,
        deleted: false
    });

    if (!user || md5(password) !== user.password) {
        req.flash("error", "Email hoặc mật khẩu không đúng");
        return res.redirect(req.get('Referer') || '/admin/auth/login');
    }

    if (user.status !== "active") {
        req.flash("error", "Tài khoản đã bị khóa");
        return res.redirect(req.get('Referer') || '/admin/auth/login');
    }

    res.cookie("token", user.token);
    res.redirect(`${systemConfig.prefixAdmin}/dashboard`);
}

// [GET] logout
module.exports.logout = async (req, res) => {
    // Xóa token trong cookie
    res.clearCookie("token");
    res.redirect(`${systemConfig.prefixAdmin}/auth/login`);

}