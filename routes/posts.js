const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const verifyToken = require("../config/verifyToken");

router.get("/", postsController.get_posts);
router.post("/", verifyToken, postsController.save_post);

module.exports = router;
