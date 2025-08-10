const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const cors = require("cors");

const Database = require("./dbconfig/db");

const authRoute = require("./routes/authRoute");
const ticketRoute = require("./routes/ticketRoute");
const flightRoute = require("./routes/flightRoute");
const staffRoute = require("./routes/staffRoute");

app.use(
  cors({
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.static("public")); // View

app.use(bodyParser.json()); //parses the body to json format
// Parse application/x-www-form-urlencoded (HTML form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use("/auth", authRoute);
app.use("/ticket", ticketRoute);
app.use("/flight", flightRoute);
app.use("/staff", staffRoute);
