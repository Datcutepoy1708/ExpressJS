module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
        const referer = req.get('Referer') || '/admin/auth/login';
        res.redirect(referer);
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu");
        const referer = req.get('Referer') || '/admin/auth/login';
        res.redirect(referer);
        return;
    }
    next();
}