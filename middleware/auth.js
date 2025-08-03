const jwt = require("jsonwebtoken");
const Response = require("../utils/response");
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

  roleAuth(req, res, next) {
    const user = req.user;
    console.log("user", user);
    if (["SuperAdmin", "Admin"].includes(user.role)) {
      next();
    } else {
      res.status(403).send(
        new Response({
          message: "You are not having authority to add new flight.",
          status: "error",
          code: 403,
        })
      );
    }
  }
}

module.exports = new Authenticate();
