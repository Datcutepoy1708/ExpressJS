const Role = require("../../models/roles.model")
const systemConfig = require("../../config/system");
const Account= require("../../models/account.model");
// [GET] /admin/roles
module.exports.index = async (req, res) => {

  let find = {
    deleted: false
  }
  const records = await Role.find(find);
  for(const record of records) {
    if(record.editedBy && record.editedBy.length > 0) {
      const lastEdit=record.editedBy[record.editedBy.length-1];
      const editUser = await Account.findOne({
        _id:lastEdit.account_id
      })
      if(editUser){
        record.lastEditBy=editUser.fullName
        record.lastEditAt=lastEdit.editedAt
        record.editedBy=record.editedBy.length
      }
    }
  }
  res.render("admin/pages/roles/index", {
    pageTitle: "Trang nhóm quyền",
    records: records
  })
}
// [GET] /admin/roles/create
module.exports.create = async (req, res) => {
  res.render("admin/pages/roles/create", {
    pageTitle: "Tạo nhóm quyền"
  })
}

//[POST] admin/roles/createPost
module.exports.createPost = async (req, res) => {
  const records = new Role(req.body);
  await records.save();
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}
// [GET] /admin/roles/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const id = req.params.id;

    let find = {
      _id: id,
      deleted: false
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/edit", {
      pageTitle: "Chỉnh sửa nhóm phân quyền",
      data: data
    })
  } catch (error) {
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  }
}

// [PATCH] /admin/roles/edit/:id

module.exports.editPatch = async (req, res) => {
  try {
    const id = req.params.id;
    await Role.updateOne({ _id: id }, {...req.body, $push: {
      editedBy: {
        account_id:res.locals.user.id,
        editedAt: new Date()
      }
    }});
    res.flash("success", "Cập nhật nhóm quyền thành công");
    res.redirect(`${systemConfig.prefixAdmin}/roles`);
  } catch (error) {
    req.flash("error", "Cập nhật không thành công");
  }
  res.redirect(`${systemConfig.prefixAdmin}/roles`);
}
// Detail Roles
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const data = await Role.findOne(find);
    res.render("admin/pages/roles/detail", {
      pageTitle: "Thông tin nhóm quyền",
      data: data,
    })
  } catch (error) {
    req.flash("error", " vui lòng load lại")
    res.redirect(`${systemConfig.prefixAdmin}/roles`)
  }
}
// Delete Roles
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  await Role.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() },);
  const referer = req.get('Referer') || '/admin/roles';
  res.redirect(referer);
}

// GET Permissions
module.exports.permissions = async (req, res) => {
  let find = {
    deleted: false
  }
  const records = await Role.find(find);
  res.render("admin/pages/roles/permissions", {
    pageTitle: "Phân quyền",
    records: records
  })
}
module.exports.permissionsPatch = async (req, res) => {
  const permissions = JSON.parse(req.body.permissions);
  for (const item of permissions) {
    await Role.updateOne({ _id: item.id }, { permissions: item.permissions })
  }
  req.flash("success","Cập nhật phân quyền thành công");
  const referer = req.get('Referer') || '/admin/roles';
  res.redirect(referer);
}