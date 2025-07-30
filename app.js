const express = require("express");
const app = express();

const authRoute = require("./routes/authRoute");

app.use(express.static("public"));

app.listen(3000, () => {
  console.log("server is running on port 3000");
});

app.use("/register", authRoute);
