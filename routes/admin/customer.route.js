const express=require("express");
const controller=require("../../controllers/admin/customer.controller.js");
const router=express.Router();

router.get("/",controller.index);
router.patch("/change-status/:status/:_id",controller.changeStatus);
module.exports=router