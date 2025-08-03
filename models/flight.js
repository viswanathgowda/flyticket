const { DataTypes } = require("sequelize");
const Database = require("../dbconfig/db");
const sequelize = Database.getInstance();

const Flight = sequelize.define(
  "flight",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    flightName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    flightNo: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
    },
    flightStartsAt: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    flightEndsAt: {
      type: DataTypes.STRING(100),
      allowNull: false,
    },
    flightOnboardedAt: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    tableName: "flight",
    timestamps: true,
    createdAt: "createdAt",
    updatedAt: "updatedAt",
  }
);

module.exports = Flight;
