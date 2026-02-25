// [GET] /admin/account
const md5 = require("md5");
const Account = require("../../models/account.model");
const Role = require("../../models/roles.model");
const systemConfig = require("../../config/system");

module.exports.index = async (req, res) => {
    let find = {
        deleted: false
    };

    const records = await Account.find(find).select("-password -token");
    for (const record of records) {
        const role = await Role.findOne({
            _id: record.role_id,
            deleted: false
        });
        record.role = role;
    }
    res.render("admin/pages/accounts/index", {
        pageTitle: "Danh sách tài khoản",
        records: records
    })
}

//[GET] admin/accout/create
module.exports.create = async (req, res) => {
    const roles = await Role.find({
        deleted: false
    })
    res.render("admin/pages/accounts/create", {
        pageTitle: "Danh sách tài khoản",
        roles: roles
    })
}

//[POST] admin/account/create
module.exports.createPost = async (req, res) => {
    const emailExist = await Account.findOne({
        email: req.body.email,
        deleted: false
    });
    if (emailExist) {
        req.flash("error", "Email đã tồn tại vui lòng sử dụng email khác");
        const referer = req.get('Referer') || '/admin/accounts';
        res.redirect(referer);
    } else {
        req.body.password = md5(req.body.password);
        const records = new Account(req.body);
        await records.save();

        res.redirect(`${systemConfig.prefixAdmin}/accounts`)
    }
}
// [GET] admin/edit/:id
module.exports.edit = async (req, res) => {
    let find = {
        _id: req.params.id,
        deleted: false
    };
    try {
        const data = await Account.findOne(find);
        const roles = await Role.find({
            deleted: false
        })
        res.render("admin/pages/accounts/edit", {
            pageTitle: "Chỉnh sửa tài khoản",
            data: data,
            roles: roles,
        })
    } catch (error) {
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}
// Edit Patch Account
module.exports.editPatch = async (req, res) => {
    const id = req.params.id;

    const emailExist = await Account.findOne({
        _id: { $ne: id },
        email: req.body.email,
        deleted: false
    });

    if (emailExist) {
        res.redirect("error", `Email đã tồn tại`)
    } else {
        if (req.body.password) {
            req.body.password = md5(req.body.password)
        } else {
            delete req.body.password
        }
    }
    await Account.updateOne({ _id: id }, req.body);
    const referer = req.get('Referer') || '/admin/accounts';
    res.redirect(referer);
}
// [PATCH] /admin/accounts/change-status/:status/:id
module.exports.changeStatus = async (req, res) => {
    const status = req.params.status;
    const id = req.params.id;
    await Account.updateOne({ _id: id }, { status: status });
    req.flash("success", "Cập nhật trạng thái thành công");
    const referer = req.get('Referer') || '/admin/accounts';
    res.redirect(referer);
}
// [GET] /admin/accounts/detail/:id
module.exports.detail = async (req, res) => {
    try {
        const find = {
            deleted: false,
            _id: req.params.id
        }
        const data = await Account.findOne(find);
        const allRoles = await Role.find({ deleted: false }); // Đổi tên
        res.render("admin/pages/accounts/detail", {
            pageTitle: "Chi tiết tài khoản",
            data: data,
            allRoles:allRoles  // Đổi thành roles để không ghi đè
        })
    } catch (error) {
        req.flash("error", "Vui lòng load lại");
        res.redirect(`${systemConfig.prefixAdmin}/accounts`);
    }
}
// [DELETE] /admin/account/delete/:id
module.exports.delete = async (req, res) => {
    const id = req.params.id;
    await Account.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() },);
    const referer = req.get('Referer') || '/admin/accounts';
    res.redirect(referer);
}