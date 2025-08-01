const express = require("express");
const router = express.Router();
const TicketController = require("../controllers/ticketController");
const authMdlwr = require("../middleware/auth");
const ticketController = require("../controllers/ticketController");

router.post("/placeTicket", authMdlwr.jwtAuth, TicketController.placeTicket);
router.get("/getTicket", authMdlwr.jwtAuth, ticketController.getTicket);

module.exports = router;
