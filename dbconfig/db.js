const { Sequelize } = require("sequelize");
const mongoose = require("mongoose");
require("dotenv").config();

class Database {
  constructor() {
    this.pgInstance = Sequelize;
    this.mongoInstance = mongoose;
    this.connect();
  }

  async connect() {
    const mode = process.env.DB_MODE || "both"; // postgres | mongo | both

    if (mode === "mongo") {
      await this._connectMongo();
    }
    if (mode === "postgres") {
      await this._connectPostgres();
    }
    if (mode === "both") {
      Promise.all([this._connectMongo(), this._connectPostgres()]);
    }
  }

  async _connectPostgres() {
    this.pgInstance = new Sequelize(
      process.env.PG_DB_NAME,
      process.env.PG_DB_USER,
      process.env.PG_DB_PASS,
      {
        host: process.env.PG_DB_HOST,
        dialect: "postgres",
        port: process.env.PG_DB_PORT,
        logging: false,
      }
    );

    try {
      await this.pgInstance.authenticate();
      console.log("✅ PostgreSQL connected via Sequelize");
    } catch (err) {
      console.error("❌ Unable to connect to PostgreSQL:", err);
    }
  }

  async _connectMongo() {
    try {
      await mongoose.connect(process.env.MONGO_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
      });
      this.mongoInstance = mongoose;
      console.log("✅ MongoDB connected via Mongoose");
    } catch (err) {
      console.error("❌ Unable to connect to MongoDB:", err);
    }
  }

  getPostgres() {
    if (!this.pgInstance) {
      console.log("PostgreSQL not connected. Call db.connect() first.");
    }
    return this.pgInstance;
  }

  getMongo() {
    return this.mongoInstance;
  }
}

module.exports = new Database();
