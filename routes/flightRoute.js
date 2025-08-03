const express = require("express");
const router = express.Router();
const flightController = require("../controllers/flightController");
const authMdlWr = require("../middleware/auth");

router.post(
  "/addNewFlight",
  authMdlWr.jwtAuth,
  authMdlWr.roleAuth,
  flightController.addFlight
);

module.exports = router;
