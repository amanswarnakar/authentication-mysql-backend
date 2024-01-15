const express = require("express");
const router = express.Router();
const db = require("../database/index.js");

const authController = require("../controllers/authController.js");

router.post("/register", authController.registerController);
router.post("/login", authController.loginController);

module.exports = router;
