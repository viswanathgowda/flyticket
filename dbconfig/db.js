const { Sequelize } = require("sequelize");
require("dotenv").config();

class Database {
  constructor(parameters) {
    this.sequelize = new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASS,
      {
        host: process.env.DB_HOST,
        dialect: "postgres",
        port: process.env.DB_PORT,
        logging: false,
      }
    );

    this._authenticate();
  }
  async _authenticate() {
    try {
      await this.sequelize.authenticate();
      console.log("✅ PostgreSQL connected via Sequelize");
    } catch (err) {
      console.error("❌ Unable to connect to the DB:", err);
    }
  }

  getInstance() {
    return this.sequelize;
  }
}
module.exports = new Database();
