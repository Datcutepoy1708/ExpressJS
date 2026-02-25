const express= require("express");
const router= express.Router();

const controller= require("../../controllers/clients/cart.controller.js");

router.post("/add/:productID",controller.addPost);
router.get("/",controller.index);
router.get("/update/:productID/:quantity",controller.update);
router.get("/delete/:productID",controller.delete);
module.exports=router;