const Response = require("../utils/response");
const ticketModel = require("../models/tickets");
const { Op } = require("sequelize");
const { v4: uuidv4 } = require("uuid");
const logger = require("../logger");
const email = require("../utils/emailHelper");
require("dotenv").config();

class TicketController {
  constructor() {}

  /**
   *
   * check the avl flights for the time, journey
   *
   */
  async placeTicket(req, res) {
    const user = req.user;
    const appMailId = process.env.MAIL;
    try {
      if (!user.id) {
        res.status(400).send(
          new Response({
            message: "user not found",
            code: 500,
            status: "success",
          })
        );
      }
      if (user.id) {
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

        if (user.email) {
          const body = `
            Dear ${user?.name || user?.email},

            🎉 Hooray! Your flight is officially booked, and it’s time to get excited for your upcoming adventure! ✈️ Whether you're jetting off to explore new horizons or visiting loved ones, we’re thrilled to help you take flight.

            Your Flight Details:

            Flight Number: 6E2457
            Departure: ${result.departure}
            Arrival: ${result.arrival}
            Booking Reference: ${result.ticketId}

            ✨ Next Steps:

            Check in online ${"https://github.com/viswanathgowda/flyticket"} to save time at the airport.
            Review your itinerary and ensure all details are correct.
            Pack your bags and get ready for an unforgettable journey!

            If you have any questions or need assistance, our team is here for you 24/7. Contact us at xxxx xxxx xx or reply to this email.
            Safe travels and enjoy the skies! 🌍
            Best regards,

            FlyTicket

            ${"https://github.com/viswanathgowda/flyticket"} | XXXX XXXX XX
          `;

          const emailRes = await email.sendEmail({
            from: `"FlyTicket" <${appMailId}>`,
            to: user.email,
            subject:
              "🎉 Congratulations! Your Flight is Booked – Ready to ✈️ Soar!",
            text: body,
          });
        }
      }
    } catch (err) {
      console.error("error in placing the ticket", err);
      logger.error("error in placing the ticket", { error: err });
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
      logger.error("error in fetching the ticket", { error: err });
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
