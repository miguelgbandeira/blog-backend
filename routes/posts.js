const express = require("express");
const router = express.Router();
const postsController = require("../controllers/postsController");
const verifyToken = require("../config/verifyToken");

router.get("/", postsController.getPosts);
router.post("/", verifyToken, postsController.savePost);
router.get("/:id", postsController.getPostById);
router.put("/:id", verifyToken, postsController.editPost);

module.exports = router;
