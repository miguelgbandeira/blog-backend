const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");

// router.get("/", authController.get_login);
router.post("/", authController.submit_login);

module.exports = router;
