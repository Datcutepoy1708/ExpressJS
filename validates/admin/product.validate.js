module.exports.createPost = (req, res, next) => {
    if (!req.body.title) {
        req.flash("error", "Vui lòng nhập tiêu đề");
        const referer = req.get('Referer') || '/admin/products';
        res.redirect(referer);
        return;
    }
    if (req.body.title.length < 8) {
        req.flash("error", "Vui lòng nhập tiêu đề ít nhất 8 kí tự");
        const referer = req.get('Referer') || '/admin/products';
        res.redirect(referer);
        return;
    }
    next();
}