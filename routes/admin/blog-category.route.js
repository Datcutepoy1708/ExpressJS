const express = require("express");
const multer = require("multer");
const upload = multer();
const router = express.Router();
const controller = require("../../controllers/admin/blog-category.controller");
const uploadCloud = require("../../middlewares/admin/uploadCloud.middleware");
const validate=require("../../validates/admin/blog-category.validate");

router.get("/", controller.index);
router.post(
    "/create",
    upload.single("thumbnail"),
    uploadCloud.upload,
    controller.createPost
)
router.get("/create", controller.create);
router.patch("/change-status-category/:status/:id", controller.changeStatusCategory);
router.patch("/change-multi-category", controller.changeMultiCategory)
router.delete("/delete/:id", controller.delete)
router.patch("/edit-category/:id",upload.single("thumbnail"),uploadCloud.upload,validate.createPost,controller.editPatchCategory)
router.get("/edit-category/:id", controller.editCategory);
router.get("/detail-category/:id", controller.detailCategory);
module.exports = router