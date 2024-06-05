const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");

router.get("/", postsController.get_posts);
router.post("/", postsController.save_post);

module.exports = router;
