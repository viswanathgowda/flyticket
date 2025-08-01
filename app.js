const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const authRoute = require("./routes/authRoute");
const ticketRoute = require("./routes/ticketRoute");

app.use(express.static("public"));

app.use(bodyParser.json());
// Parse application/x-www-form-urlencoded (HTML form submissions)
app.use(bodyParser.urlencoded({ extended: true }));

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use("/auth", authRoute);
app.use("/ticket", ticketRoute);
