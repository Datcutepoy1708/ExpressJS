const ProductCategory = require("../../models/product-category.model");
const filterStatusHelpers = require("../../helpers/filterStatus");
const systemConfig = require("../../config/system");
const paginationHelper = require("../../helpers/pagination");
const Account= require("../../models/account.model");
const searchHelpers = require("../../helpers/Search");
const createTreeHelpers = require("../../helpers/createTree")

module.exports.index = async (req, res) => {
  const filterStatus = filterStatusHelpers(req.query);
  let find = {
    deleted: false
  };
  if (req.query.status) {
    find.status = req.query.status;
  }
  //Pagination
  const countProducts = await ProductCategory.countDocuments(find);


  let objectPagination = paginationHelper({
    currentPage: 1,
    limitItems: 4
  },
    req.query,
    countProducts
  )
  //End Pagination
  //
  const objectSearch = searchHelpers(req.query);
  if (objectSearch.regex) {
    find.title = objectSearch.regex;
  }
  let sort = {};
  if (req.query.sortKey && req.query.sortValue) {
    sort[req.query.sortKey] = req.query.sortValue
  } else {
    sort.position = "desc";
  }

  //
  const records = await ProductCategory.find(find).sort(sort);
  for(const record of records) {
    const user=await Account.findOne({
      _id: record.createdBy.account_id
    });
    if(user){
      record.accountFullName= user.fullName
    }
    if(record.editedBy && record.editedBy.length > 0){
      const lastEdit=record.editedBy[record.editedBy.length-1];
      const editUser= await Account.findOne({
        _id:lastEdit.account_id
      })
      if(editUser){
        record.lastEditBy=editUser.fullName
        record.lastEditedAt=lastEdit.editedAt
        record.editedBy=record.editedBy.length
      }
    }
  }
  const newRecords = createTreeHelpers.tree(records);



  res.render("admin/pages/product-category/index", {
    pageTitle: "Danh mục sản phẩm",
    records: newRecords,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  })
}
module.exports.create = async (req, res) => {

  let find = {
    deleted: false
  };
  const records = await ProductCategory.find(find);

  const newRecords = createTreeHelpers.tree(records);
  console.log(newRecords);
  res.render("admin/pages/product-category/create", {
    pageTitle: "Tạo danh mục sản phẩm",
    records: newRecords,
  })
}
module.exports.createPost = async (req, res) => {
  if (!req.body.position || req.body.position === "") {
    const countProducts = await ProductCategory.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }
  req.body.createdBy = {
    account_id: res.locals.user.id
  } 

  const record = new ProductCategory(req.body);
  await record.save();
  res.redirect(`${systemConfig.prefixAdmin}/product-category`);
}

module.exports.changeStatusCategory = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  await ProductCategory.updateOne({ _id: id }, { status: status })
  req.flash("success", "Cập nhật trạng thái thành công");
  const referer = req.get('Referer') || '/admin/product-category';
  res.redirect(referer);
}

// Change-Multi
module.exports.changeMultiCategory = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");
  switch (type) {
    case "active":
      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "active" });
      req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
      break
    case "inactive":
      await ProductCategory.updateMany({ _id: { $in: ids } }, { status: "inactive" });
      req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
      break
    case "delete-all":
      await ProductCategory.updateMany({
        _id: {
          $in: ids
        }
      }, { deleted: true, deletedAt: new Date() });
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await ProductCategory.updateOne({ _id: id }, { position: position });
      }
    default:
      break;
  }
  const referer = req.get('Referer') || '/admin/product-category';
  res.redirect(referer);
}
// [DELETE] /admin/products/delete/id
module.exports.delete = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id },{deleted: true});
  await ProductCategory.updateOne({ _id: id }, { deleted: true, deletedAt: new Date() },);
  const referer = req.get('Referer') || '/admin/product-category';
  res.redirect(referer);
}
// Detail Category
module.exports.detailCategory = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const data = await ProductCategory.findOne(find);
    const category= await ProductCategory.find({
      deleted:false
    })
    const newCategory= createTreeHelpers.tree(category);
    res.render("admin/pages/product-category/detail", {
      pageTitle: "Thông tin sản phẩm",
      data: data,
      category: newCategory
    })
  } catch (error) {
    req.flash("error", " vui lòng load lại")
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
  }
}

// Edit Category

module.exports.editCategory = async (req, res) => {
   try{
      const id = req.params.id;

  const data = await ProductCategory.findOne({
    _id: id,
    deleted: false
  })

  const records = await ProductCategory.find({
    deleted: false
  })

  const newRecords = createTreeHelpers.tree(records);

  res.render("admin/pages/product-category/edit", {
    pageTitle: "Chỉnh sửa danh mục sản phẩm",
    data: data,
    records: newRecords
  })
   }catch(error){
    res.redirect(`${systemConfig.prefixAdmin}/product-category`)
   }
}

// Edit Patch Category
module.exports.editPatchCategory = async (req, res) => {
  const id = req.params.id;
  req.body.position = parseInt(req.body.position);
  await ProductCategory.updateOne({ _id: id }, {...req.body, $push: {
    editedBy: {
      account_id: res.locals.user.id,
      editedAt: new Date()
    }
  }});
  const referer = req.get('Referer') || '/admin/product-category';
  res.redirect(referer);
}