const userModel = require("../models/user");
const Response = require("../utils/response");
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";

class Auth {
  constructor(parameters) {}

  async registerUser(req, res) {
    const { name, email, password } = req.body;
    try {
      const result = await userModel.create({
        name,
        email,
        password,
      });
      console.log("result", result);
      res.status(200).send(
        new Response({
          status: "success",
          message: "User registered successfully",
          code: 200,
        })
      );
    } catch (err) {
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
        tkn = jwt.sign({ id: result.id, email: result.email }, JWT_SECRET, {
          expiresIn: "1hr",
        });
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
}

module.exports = new Auth();
