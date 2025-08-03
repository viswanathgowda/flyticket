const { DataTypes } = require("sequelize");
const Database = require("../dbconfig/db");
const sequelize = Database.getInstance();

const User = sequelize.define("user", {
  name: DataTypes.STRING,
  email: { type: DataTypes.STRING, unique: true },
  password: DataTypes.STRING,
  token: DataTypes.STRING,
  role: DataTypes.STRING,
});

module.exports = User;
