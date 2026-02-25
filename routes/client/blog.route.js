const express= require("express");
const router = express.Router();

const controller = require("../../controllers/clients/blog.controller");

router.get("/",controller.index);
router.get("/detail/:slugBlog",controller.detail);
router.get("/:slugCategory",controller.category);
module.exports = router;