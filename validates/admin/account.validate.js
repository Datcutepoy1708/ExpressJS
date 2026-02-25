// Thêm vào validates/admin/account.validate.js

module.exports.createPost = (req, res, next) => {
    if (!req.body.fullName) {
        req.flash("error", "Vui lòng nhập họ tên");
        const referer = req.get('Referer') || '/admin/accounts';
        res.redirect(referer);
        return;
    }
    if (!req.body.email) {
        req.flash("error", "Vui lòng nhập email");
        const referer = req.get('Referer') || '/admin/accounts';
        res.redirect(referer);
        return;
    }
    // KHÔNG require password cho edit - chỉ validate nếu có nhập
    if (req.body.password && req.body.password.length < 6) {
        req.flash("error", "Mật khẩu phải có ít nhất 6 ký tự");
        const referer = req.get('Referer') || '/admin/accounts';
        res.redirect(referer);
        return;
    }
    next();
}