const express=require("express");
const controller=require("../../controllers/admin/order.controller");
const router=express.Router();

router.get("/",controller.index);
router.patch("/change-status/:status/:_id",controller.changeStatus);
router.patch("/change-multi",controller.changeMulti);
router.get("/detail/:id",controller.detail);
router.delete("/delete/:_id",controller.delete);
module.exports=router;