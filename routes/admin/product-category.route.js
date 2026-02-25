const express = require("express");
const router = express.Router();
const controller=require("../../controllers/admin/product-category.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
router.get("/", controller.index);
const multer=require("multer");
const upload=multer();
const validate = require('../../validates/admin/product-category.validate')

router.get("/create",controller.create);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    // validate.createPost,
    controller.createPost
)
router.patch("/change-status-category/:status/:id", controller.changeStatusCategory);
router.patch("/change-multi-category", controller.changeMultiCategory)
router.delete("/delete/:id", controller.delete)
router.get("/edit-category/:id",controller.editCategory);
router.get("/detail-category/:id",controller.detailCategory)
router.patch("/edit-category/:id",upload.single("thumbnail"),uploadCloud.upload,validate.createPost,controller.editPatchCategory)
module.exports = router;

