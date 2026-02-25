const User = require("../../models/users.model");
const ForgotPassword = require("../../models/forgot-password.model");
const Cart = require("../../models/cart.model");
const generateHelper = require("../../helpers/generate");
const sendMailHelper = require("../../helpers/sendMail");
const md5 = require("md5");

module.exports.register = async (req, res) => {
    res.render("client/pages/user/register", {
        pageTitle: "Đăng kí tài khoản"
    })
}
module.exports.registerPost = async (req, res) => {
    const existEmail = await User.findOne({
        email: req.body.email,
        deleted: false,
    })
    if (existEmail) {
        req.flash("error", "Email đã tồn tại");
        res.redirect("/user/register");
    }
    req.body.password = md5(req.body.password);
    const user = new User(req.body);
    await user.save();

    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/");
}

module.exports.login = async (req, res) => {
    res.render("client/pages/user/login", {
        pageTitle: "Đăng nhập tài khoản"
    })
}

module.exports.loginPost = async (req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Tài khoản không tồn tại")
        res.redirect("/user/login")
    }

    if (md5(password) != user.password) {
        req.flash("error", "Sai mật khẩu vui lòng nhập lại"),
            res.redirect("/user/login")
    }
    if (user.status == "inactive") {
        req.flash("error", "Tài khoản đã bị xóa");
        res.redirect("/user/login");
    }


    res.cookie("tokenUser", user.tokenUser);

    await User.updateOne({ _id: user.id }, { statusOnline: "online" })

    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_ONLINE", user.id);
    })

    // Lưu user_id vào collection cart
    await Cart.updateOne({
        _id: req.cookies.cartID
    }, {
        user_id: user.id
    })
    res.redirect("/");
}

module.exports.logout = async (req, res) => {
    await User.updateOne({
        _id: res.locals.user.id
    }, {
        statusOnline: "offline"
    })
    _io.once('connection', (socket) => {
        socket.broadcast.emit("SERVER_RETURN_USER_OFFLINE", user.id);
    })

    res.clearCookie("tokenUser");
    res.redirect("/")
}

module.exports.forgotPassword = async (req, res) => {
    res.render("client/pages/user/forgot-password", {
        pageTitle: "Lấy lại mật khẩu",
    })
}
module.exports.forgotpasswordPost = async (req, res) => {
    const email = req.body.email;
    const user = await User.findOne({
        email: email,
        deleted: false
    })
    if (!user) {
        req.flash("error", "Email không tồn tại");
    } else {
        // Tạo mã OTP và lưu OTP, email  vào trong cái collection forgot-password
        const otp = generateHelper.generateRandomNumber(6);
        const objectForgotPassword = {
            email: email,
            otp: otp,
            expireAt: Date.now()
        }
        const forgotPassword = new ForgotPassword(objectForgotPassword);
        await forgotPassword.save();


        // Gửi mã OTP qua mail
        const subject = `Mã OTP xác minh lấy lại mật khẩu`;
        const html = `
         Mã OTP xác minh lấy lại mật khẩu là <b>${otp}</b>. Thời hạn sử dụng là 1 phút. Lưu ý không được để lộ mã OPT cho bất cứ ai
        `;
        sendMailHelper.sendMail(email, subject, html);
        res.redirect(`/user/password/otp?email=${email}`)
    }
}

module.exports.otpPassword = async (req, res) => {
    const email = req.query.email;
    res.render("client/pages/user/otp-password", {
        pageTitle: "Nhập mã OTP",
        email: email
    })
}

module.exports.otpPasswordPost = async (req, res) => {
    const email = req.body.email;
    const otp = req.body.otp;
    const result = await ForgotPassword.findOne({
        email: email,
        otp: otp
    })

    if (!result) {
        req.flash("error", `OTP không hợp lệ`)
        res.redirect("/user/password/otp");
    }
    const user = await User.findOne({
        email: email,
    })
    res.cookie("tokenUser", user.tokenUser);
    res.redirect("/user/password/reset");
}

module.exports.resetPassword = (req, res) => {
    res.render("client/pages/user/reset-password", {
        pageTitle: "Thay đổi mật khẩu"
    })
}


module.exports.resetPasswordPost = async (req, res) => {
    const password = req.body.password;
    const tokenUser = req.cookies.tokenUser;
    await User.updateOne({
        tokenUser: tokenUser
    }, {
        password: md5(password)
    })
    res.redirect("/user/login");
}

module.exports.info = async (req, res) => {
    res.render("client/pages/user/info", {
        pageTitle: "Thông tin tài khoản"
    })
}