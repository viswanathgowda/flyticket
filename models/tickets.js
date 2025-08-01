const { DataTypes } = require("sequelize");
const Database = require("../dbconfig/db");
const sequelize = Database.getInstance();

const Tickets = sequelize.define("tickets", {
  ticketId: {
    type: DataTypes.UUID,
    allowNull: false,
    primaryKey: true,
    unique: true,
  },
  departure: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  arrival: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  ticketPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  finalPrice: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  discount: {
    type: DataTypes.FLOAT,
    allowNull: false,
  },
  userEmail: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userPhone: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  createdAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    allowNull: false,
    defaultValue: DataTypes.NOW,
  },
});

module.exports = Tickets;
