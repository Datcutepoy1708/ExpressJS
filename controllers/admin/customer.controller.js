const User = require("../../models/users.model");
const paginationHelper = require("../../helpers/pagination");
const filterStatusHelpers = require("../../helpers/filterStatus");
const searchHelpers = require("../../helpers/Search");
module.exports.index = async (req, res) => {
    const filterStatus = filterStatusHelpers(req.query);
    let find = {
        deleted: false
    }
    const countCustomers = await User.countDocuments(find);
    let objectPagination = paginationHelper({
        currentPage: 1,
        limitItems: 4
    },
        req.query,
        countCustomers
    )
    const objectSearch = searchHelpers(req.query);
    if (objectSearch.regex) {
        find.title = objectSearch.regex
    }
    let sort = {}
    if (req.query.sortKey && req.query.sortValue) {
        sort[req.query.sortKey] = req.query.sortValue
    } else {
        sort.position = "desc"
    }
    const customer = await User.find(find);
    res.render("admin/pages/customer/index", {
        pageTitle: "Danh sách tài khoản",
        customer: customer,
        filterStatus: filterStatus,
        pagination: objectPagination
    })
}
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params._id;
    await User.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công");
    const referer = req.get('Referer') || '/admin/user';
    res.redirect(referer);
}