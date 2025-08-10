const express = require("express");
const router = express.Router();
const staffCntlr = require("../controllers/staffController");

router.post("/register", staffCntlr.registerStaff);
router.get("/getStaff", staffCntlr.getStaff);

module.exports = router;
