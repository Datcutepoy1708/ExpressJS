const express=require("express");
const multer=require("multer");
const upload=multer()
const router=express.Router()
const uploadCloud=require("../../middlewares/admin/uploadCloud.middleware");
const controller=require("../../controllers/admin/blog.controller");
const validate=require("../../validates/admin/blog.validate");
router.get("/",controller.index);
router.get("/create",controller.create);
router.patch("/change-status/:status/:id",controller.changeStatus);
router.patch("/change-multi",controller.changeMulti);
router.post("/create", upload.single('thumbnail'),
    uploadCloud.upload,
    validate.createBlog,
    controller.createPost,
)
router.get("/edit/:id",controller.edit);
router.delete("/delete/:id",controller.delete);
router.get("/detail/:id",controller.detail);
router.patch("/edit/:id",upload.single("thumbnail"),validate.createBlog,controller.editPatch)
module.exports=router