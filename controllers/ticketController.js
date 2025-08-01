const Response = require("../utils/response");
const ticketModel = require("../models/tickets");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
class TicketController {
  constructor() {}

  /**
   *
   * check the avl flights for the time, journey
   *
   */
  async placeTicket(req, res) {
    const user = req.user;
    console.log("user", user);
    try {
      if (!user) {
        res.status(400).send(
          new Response({
            message: "user not found",
            code: 500,
            status: "success",
          })
        );
      }
      if (user) {
        const {
          departure,
          arrival,
          ticketPrice,
          finalPrice,
          discount,
          userEmail,
          userPhone,
        } = req.body;
        const ticket = {
          ticketId: uuidv4(),
          departure,
          arrival,
          ticketPrice,
          finalPrice,
          discount,
          userEmail,
          userPhone,
        };
        const result = await ticketModel.create({ ...ticket });
        res.status(200).send(
          new Response({
            message: "placed ticket successfully!",
            code: 200,
            data: result,
            status: "success",
          })
        );
      }
    } catch (err) {
      res.status(500).send(
        new Response({
          message: "internal server error",
          error: err,
          code: 500,
          status: "failed",
        })
      );
    }
  }

  async getTicket(req, res) {
    const user = req.user;
    try {
      if (!user?.email && !user?.phone) {
        return res.status(400).send(
          new Response({
            message: "user email or phone not found",
            status: "success",
            code: 400,
          })
        );
      }
      const conditions = [];
      if (user?.email) {
        conditions.push({ userEmail: user?.email });
      }
      if (user?.phone) {
        conditions.push({ userPhone: user?.phone });
      }
      const result = await ticketModel.findAll({
        where: {
          [Op.or]: conditions,
        },
      });
      res.status(200).send(
        new Response({
          message: "tickets fetched successfully!",
          code: 200,
          status: "success",
          data: result,
        })
      );
    } catch (err) {
      console.log("error in fetching tickets", err);
      res.status(500).send(
        new Response({
          message: "internal server error",
          code: 500,
          status: "failed",
          error: err,
        })
      );
    }
  }
}

module.exports = new TicketController();
