const express= require("express");
const router= express.Router();
const controller=require("../../controllers/clients/users.controller");

router.get("/not-friend",controller.notFriend);
router.get("/request",controller.request);
router.get("/friends",controller.friend);
router.get("/accept",controller.accept);
module.exports=router;