// [GET] /admin/products
const Product = require("../../models/product.model")
const systemConfig = require("../../config/system")
const filterStatusHelpers = require("../../helpers/filterStatus");
const paginationHelper = require("../../helpers/pagination");
const Account = require("../../models/account.model");
const searchHelpers = require("../../helpers/Search");
const ProductCategory = require("../../models/product-category.model");
const createTreeHelpers = require("../../helpers/createTree");
module.exports.index = async (req, res) => {

  // Đoạn bộ lọc 
  const filterStatus = filterStatusHelpers(req.query);

  let find = {
    deleted: false
  };

  if (req.query.status) {
    find.status = req.query.status;
  }

  // Pagination
  const countProducts = await Product.countDocuments(find);

  let objectPagination = paginationHelper({
    currentPage: 1,
    limitItems: 4
  },
    req.query,
    countProducts
  )
  // End Pagination
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

  const products = await Product.find(find).sort(sort).limit(objectPagination.limitItems).skip(objectPagination.skip);
  for (const product of products) {
    const user = await Account.findOne({
      _id: product.createdBy.account_id
    });
    if (user) {
      product.accountFullName = user.fullName
    }

    // Lấy ra người thông tin cập nhật
    if (product.editedBy && product.editedBy.length > 0) {
      const lastEdit = product.editedBy[product.editedBy.length - 1];
      const editUser = await Account.findOne({
        _id: lastEdit.account_id
      })
      if (editUser) {
        product.lastEditBy = editUser.fullName
        product.lastEditedAt = lastEdit.editedAt
        product.editedBy = product.editedBy.length
      }
    }

  }
  res.render("admin/pages/products/index", {
    pageTitle: "Danh sách sản phẩm",
    products: products,
    filterStatus: filterStatus,
    keyword: objectSearch.keyword,
    pagination: objectPagination
  })
  // Truyền data ra ngoài giao diên
}

// [PATCH] /admin/products/change-status/:status/:id

module.exports.changeStatus = async (req, res) => {
  const status = req.params.status;
  const id = req.params.id;

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  await Product.updateOne({ _id: id }, { status: status, $push: { updatedBy: updatedBy } })
  req.flash("success", "Cập nhật trạng thái thành công");
  const referer = req.get('Referer') || '/admin/products';
  res.redirect(referer);
}

// [PATCH] /admin/products/change-multi
module.exports.changeMulti = async (req, res) => {
  const type = req.body.type;
  const ids = req.body.ids.split(", ");

  const updatedBy = {
    account_id: res.locals.user.id,
    updatedAt: new Date()
  }

  switch (type) {
    case "active":
      await Product.updateMany({ _id: { $in: ids } }, { status: "active", $push: { updatedBy: updatedBy } });
      req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
      break
    case "inactive":
      await Product.updateMany({ _id: { $in: ids } }, { status: "inactive", $push: { updatedBy: updatedBy } });
      req.flash("success", `Cập nhật trạng thái thành công của ${ids.length} sản phẩm`)
      break
    case "delete-all":
      await Product.updateMany({
        _id: {
          $in: ids
        }
      }, {
        deleted: true, deletedBy: {
          account_id: res.locals.user.id,
          deletedAt: new Date()
        }
      });
    case "change-position":
      for (const item of ids) {
        let [id, position] = item.split("-");
        position = parseInt(position);
        await Product.updateOne({ _id: id }, { position: position, $push: { updatedBy: updatedBy } });
      }
    default:
      break;
  }
  const referer = req.get('Referer') || '/admin/products';
  res.redirect(referer);
}

// [DELETE] /admin/products/delete/id
module.exports.deleteItem = async (req, res) => {
  const id = req.params.id;
  // await Product.deleteOne({ _id: id },{deleted: true});
  await Product.updateOne({ _id: id }, {
    deleted: true, deletedBy: {
      account_id: res.locals.user.id,
      deletedAt: new Date()
    }
  },);
  const referer = req.get('Referer') || '/admin/products';
  res.redirect(referer);
}
// [GET]  /admin/products/create
module.exports.create = async (req, res) => {
  let find = {
    deleted: false
  }
  const category = await ProductCategory.find(find);
  const newCategory = createTreeHelpers.tree(category);
  res.render("admin/pages/products/create", {
    pageTitle: "Thêm mới sản phẩm",
    category: newCategory
  })
}
// [POST] /admin/products/create
module.exports.createPost = async (req, res) => {


  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if (!req.body.position || req.body.position === "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }

  req.body.createdBy = {
    account_id: res.locals.user.id,
  }

  const product = new Product(req.body);
  await product.save();
  res.redirect(`${systemConfig.prefixAdmin}/products`);
}
// /admin/products/edit/:id
module.exports.edit = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };

    const category = await ProductCategory.find({
      deleted: false
    })
    const newCategory = createTreeHelpers.tree(category);
    const product = await Product.findOne(find);
    res.render("admin/pages/products/edit", {
      pageTitle: "Chỉnh sửa sản phẩm",
      product: product,
      category: newCategory
    })
  } catch (error) {
    req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}
// [PATCH] /admin/products/edit/:id
module.exports.editPatch = async (req, res) => {
  let find = {
    deleted: false
  }
  req.body.price = parseInt(req.body.price);
  req.body.discountPercentage = parseInt(req.body.discountPercentage)
  req.body.stock = parseInt(req.body.stock)
  if (!req.body.position || req.body.position === "") {
    const countProducts = await Product.countDocuments();
    req.body.position = countProducts + 1;
  } else {
    req.body.position = parseInt(req.body.position);
  }


  try {

    const editedBy = {
      account_id: res.locals.user.id,
      editedAt: new Date()
    }


    await Product.updateOne({
      _id: req.params.id
    }, { ...req.body, $push: { editedBy: editedBy } })
  } catch (error) {
    req.flash("error", " Đã sửa thành công sản phẩm")
  }
  const referer = req.get('Referer') || '/admin/products';
  res.redirect(referer);
}
// [GET] detail/:id
module.exports.detail = async (req, res) => {
  try {
    const find = {
      deleted: false,
      _id: req.params.id
    };
    const product = await Product.findOne(find);
    console.log(product);
    res.render("admin/pages/products/detail", {
      pageTitle: "Chi tiết sản phẩm",
      product: product
    })
  } catch (error) {
    req.flash("error", "Chỉnh sửa bị lỗi vui lòng load lại")
    res.redirect(`${systemConfig.prefixAdmin}/products`)
  }
}
