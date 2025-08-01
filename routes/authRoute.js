const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");

router.post("/register", auth.registerUser);
router.get("/login", auth.login);
router.post("/logout", auth.logout);

module.exports = router;
