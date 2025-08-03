const userModel = require("../models/user");
const Response = require("../utils/response");
const jwt = require("jsonwebtoken");
const logger = require("../logger");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

class Auth {
  constructor(parameters) {}

  async registerUser(req, res) {
    const { name, email, password, role } = req.body;
    try {
      const body = {
        name,
        email,
        password,
      };
      if (role) {
        body.role = role;
      }
      const result = await userModel.create({ ...body });
      res.status(200).send(
        new Response({
          status: "success",
          message: "User registered successfully",
          data: result,
          code: 200,
        })
      );
    } catch (err) {
      console.error("error in registering user", err);
      logger.error("error in registering user", { error: err });
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).send(
          new Response({
            message: err.errors[0].message || "Duplicate entry",
            code: 409,
            status: "fail",
          })
        );
      }

      if (err.name === "SequelizeValidationError") {
        return res.status(400).send(
          new Response({
            message: err.message,
            code: 400,
            status: "fail",
          })
        );
      }
      res.status(500).send(
        new Response({
          status: "failed",
          message: "failed to register the user",
          code: 500,
          error: { message: err.errors[0].message },
        })
      );
    }
  }

  async updateUser(req, res) {
    try {
      const updatingData = req.body;
      const user = req.user;
      const result = await userModel.update(
        {
          ...updatingData,
        },
        {
          where: { id: user.id },
        }
      );
      res.status(200).send(
        new Response({
          message: "user updated successfully.",
          code: 200,
          status: "success",
          data: result,
        })
      );
    } catch (err) {
      console.error("error in updating user", err);
      logger.error("error in updating user", { error: err });
      if (err.name === "SequelizeUniqueConstraintError") {
        return res.status(409).send(
          new Response({
            message: err.errors[0].message || "Duplicate entry",
            code: 409,
            status: "fail",
          })
        );
      }

      if (err.name === "SequelizeValidationError") {
        return res.status(400).send(
          new Response({
            message: err.message,
            code: 400,
            status: "fail",
          })
        );
      }
      res.status(500).send(
        new Response({
          status: "failed",
          message: "failed to update the user",
          code: 500,
          error: {
            message:
              err?.errors?.[0]?.message || err.message || "Unknown error",
          },
        })
      );
    }
  }

  async login(req, res) {
    const { email, password } = req.body;
    try {
      const result = await userModel.findOne({
        where: {
          email: email,
          password: password,
        },
      });

      if (!result) {
        res.status(401).send(
          new Response({
            message: "invalid credentials",
            status: "success",
            code: 401,
          })
        );
      }

      /**
       * token db YES- verufy jwt YES-> use : No-> create jwt tkn
       * token db No - create jwt tkn
       */
      let tkn;
      let tknExp = false;
      if (result.token) {
        jwt.verify(result.token, JWT_SECRET, (err, user) => {
          if (err) {
            console.log("verify tkn err", err);
            tknExp = true;
          }
          if (user) {
            console.log("user", user);
            tkn = result.token;
          }
        });
      }
      if (!result.token || tknExp) {
        tkn = jwt.sign(
          {
            id: result.id,
            email: result.email,
            role: `${result?.role ? result?.role : "NA"}`,
          },
          JWT_SECRET,
          {
            expiresIn: "1hr",
          }
        );
        result.token = tkn;
        await result.save();
      }

      res.status(200).send(
        new Response({
          status: "success",
          message: "user login success",
          data: {
            token: tkn,
            email: result.email,
            name: result.name,
          },
        })
      );
    } catch (err) {
      console.error("user login failed", err);
      logger.error("user failed to login", { error: err });
      res.status(500).send(
        new Response({
          status: "failed",
          message: "user login failed",
          code: 500,
          error: err,
        })
      );
    }
  }

  async logout(req, res) {
    const token = req.headers.authorization;
    try {
      const fnTkn = token.split(" ")[1];
      const tkn = jwt.verify(fnTkn, JWT_SECRET);
      if (tkn) {
        const r = await userModel.findOne({
          where: {
            token: fnTkn,
          },
        });
        r.token = null;
        r.save();
      }
      res.status(200).send(
        new Response({
          message: "logout done successfully",
          code: 200,
          status: "success",
        })
      );
    } catch (err) {
      console.error("error while logout", err);
      logger.error("error while logout", { error: err });

      res.status(500).send(
        new Response({
          message: "internal sever error while logout",
          code: 500,
          status: "failed",
          error: err,
        })
      );
    }
  }

  async getAllUsers(req, res) {
    try {
      const page = parseInt(req.params.page) || 1;
      const limit = parseInt(req.params.limit) || 10;
      const offset = (page - 1) * limit;
      const result = await userModel.findAndCountAll({
        limit,
        offset,
        order: [["createdAt"]],
        attributes: ["name", "email", "createdAt"],
      });
      const resultData = {
        currentPage: page,
        totalPages: Math.ceil(result.count / limit),
        totalUsers: result.count,
        userInfo: result,
      };
      res.status(200).send(
        new Response({
          message: "all users fetched sucessfully",
          status: "success",
          code: 200,
          data: resultData,
        })
      );
    } catch (err) {
      console.error("error in fetching all users", err);
      logger.error("error in fetching all users", { error: err });
    }
  }
}

module.exports = new Auth();
