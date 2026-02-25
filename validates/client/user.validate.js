module.exports.registerPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lònng nhập họ và tên");
        const referer = req.get('Referer') || '/user/register';
        res.redirect(referer);
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email của bạn ");
        const referer = req.get('Referer') || '/user/register';
        res.redirect(referer);
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu của bạn ");
        const referer = req.get('Referer') || '/user/register';
        res.redirect(referer);
        return;
    }
    next();
}


module.exports.loginPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email của bạn ");
        const referer = req.get('Referer') || '/user/login';
        res.redirect(referer);
        return;
    }
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu của bạn ");
        const referer = req.get('Referer') || '/user/login';
        res.redirect(referer);
        return;
    }
    next();
}


module.exports.forgotpasswordPost = (req, res, next) => {
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email của bạn ");
        const referer = req.get('Referer') || '/user/password/forgot';
        res.redirect(referer);
        return;
    }
    next();
}

module.exports.resetPasswordPost = (req, res, next) => {
    if (!req.body.password) {
        req.flash("error", "Vui lòng nhập mật khẩu mới của bạn ");
        const referer = req.get('Referer') || '/user/password/reset';
        res.redirect(referer);
        return;
    }
    if (!req.body.confirmPassword) {
        req.flash("error", "Vui lòng xác nhận mật khẩu mới của bạn ");
        const referer = req.get('Referer') || '/user/password/reset';
        res.redirect(referer);
        return;
    }
      if ( req.body.password !==  req.body.confirmPassword) {
        req.flash("error", "Mật khẩu khôn trùng khớp");
        const referer = req.get('Referer') || '/user/password/reset';
        res.redirect(referer);
        return;
    }
    next();
}