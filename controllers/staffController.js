const staffModel = require("../models/staff");
const Response = require("../utils/response");
const logger = require("../logger");

class Staff {
  constructor() {}

  async registerStaff(req, res, next) {
    const { name, bio, address, role } = req.body;
    try {
      const staff = staffModel.create({
        name: name,
        bio: bio,
        address: address,
        role: role,
      });

      res.status(201).send(
        new Response({
          status: "success",
          data: staff,
          code: 201,
          message: "regiested staff succesfully",
        })
      );
    } catch (err) {
      console.log("failed to register the staff", err);
      res.status(500).send(
        new Response({
          message: "Internal server error",
          error: err,
          status: "failed",
          code: 500,
        })
      );
      logger.error("internal server error at register staff", { error: err });
    }
  }

  async getStaff(req, res, next) {
    try {
      const filters = {};

      if (req.query.name) {
        // Partial name match, case-insensitive
        filters.name = { $regex: req.query.name, $options: "i" };
      }

      if (req.query.role) {
        filters.role = req.query.role; // exact match
      }

      if (req.query.joinedAfter) {
        filters.joinedOn = { $gte: new Date(req.query.joinedAfter) };
      }

      const page = parseInt(req.query.page) > 0 ? parseInt(req.query.page) : 1;
      const limit =
        parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 10;
      const skip = (page - 1) * limit;

      const result = await staffModel.find(filters).skip(skip).limit(limit);

      res.status(200).send(
        new Response({
          message: "staff fetched",
          data: result,
          code: 200,
          status: "success",
        })
      );
    } catch (err) {
      console.error("failed in fetching staff", err);
      logger.error("failed in fetching staff", { error: err });
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

module.exports = new Staff();
