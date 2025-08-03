const express = require("express");
const router = express.Router();
const auth = require("../controllers/authController");
const authMdlWr = require("../middleware/auth");

router.post("/register", auth.registerUser);
router.get("/login", auth.login);
router.post("/logout", auth.logout);
router.put("/updateUser", authMdlWr.jwtAuth, auth.updateUser);

module.exports = router;
