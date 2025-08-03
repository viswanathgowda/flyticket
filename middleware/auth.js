const jwt = require("jsonwebtoken");
const Response = require("../utils/response");
const logger = require("../logger");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

class Authenticate {
  constructor() {}

  jwtAuth(req, res, next) {
    const token = req.headers.authorization;

    try {
      if (!token) {
        return res.status(401).send(
          new Response({
            message: "token not provided",
            code: 401,
            status: "success",
          })
        );
      }
      if (token && token.startsWith("Bearer ")) {
        const tkn = token.split(" ")[1];
        jwt.verify(tkn, JWT_SECRET, (err, user) => {
          if (err) {
            return res.status(403).send(
              new Response({
                message: "Invalid token",
                code: 403,
                status: "success",
                error: err,
              })
            );
          }
          console.log("user authenticated");
          req.user = user;
          next();
        });
      } else {
        res.status(403).send(
          new Response({
            message: "Bearer is missing",
            code: 403,
            status: "success",
          })
        );
      }
    } catch (err) {
      logger.error("error in verifying the auth", { error: err });
      res.status(500).send(
        new Response({
          message: "internal server error at verifying the auth",
          code: 500,
          status: "failed",
          error: err,
        })
      );
    }
  }

  adminAuth(req, res, next) {
    const user = req.user;
    if (["SuperAdmin", "Admin"].includes(user.role)) {
      next();
    } else {
      res.status(403).send(
        new Response({
          message: "You are not having authority to do this operation",
          status: "error",
          code: 403,
        })
      );
    }
  }

  updateUserAuth(req, res, next) {
    try {
      const user = req.user;
      const updatingData = req.body;
      if (updatingData?.role) {
        if (["SuperAdmin", "Admin"].includes(user?.role)) {
          next();
        } else {
          res
            .status(403)
            .send(
              new Response({
                message: "you are not having authority to update role",
                status: "success",
                code: 403,
              })
            );
        }
      } else {
        next();
      }
    } catch (err) {
      res
        .status(500)
        .send(
          new Response({
            message: "Internal Server Error",
            code: 500,
            status: "failed",
          })
        );
    }
  }
}

module.exports = new Authenticate();
