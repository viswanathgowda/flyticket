const flightModel = require("../models/flight");
const Response = require("../utils/response");

class Flight {
  constructor() {}

  async addFlight(req, res) {
    const {
      flightName,
      flightNo,
      flightStartsAt,
      flightEndsAt,
      flightOnboardedAt,
    } = req.body;
    try {
      const flight = {
        flightName: flightName,
        flightNo: flightNo,
        flightStartsAt: flightStartsAt,
        flightEndsAt: flightEndsAt,
        flightOnboardedAt: new Date(flightOnboardedAt),
      };
      const result = await flightModel.create({ ...flight });
      res.status(200).send(
        new Response({
          message: "new flight added.",
          code: 200,
          status: "success",
          data: result,
        })
      );
    } catch (err) {
      console.error("error in adding new flight", err);
      // Handle unique constraint violation (duplicate flightNo)
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).send(
          new Response({
            message: err.errors[0].message || "Duplicate entry",
            code: 409,
            status: "fail",
          })
        );
      }

      // Handle other Sequelize validation errors
      if (err.name === "SequelizeValidationError") {
        return res.status(400).send(
          new Response({
            message: err.message,
            code: 400,
            status: "fail",
          })
        );
      }

      // Unhandled error
      res.status(500).send(
        new Response({
          message: "Internal Server Error",
          code: 500,
          status: "error",
        })
      );
    }
  }
}

module.exports = new Flight();
