const Database = require("../dbconfig/db");
const mongoose = Database.getMongo();

const staffSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    joinedOn: { type: Date, default: Date.now },
    left: { type: Date },
    role: {
      type: String,
      enum: ["Pilot", "Cabin Crew", "Ground Staff", "Maintenance"],
      required: true,
    },
    bio: { type: String },
    address: { type: String },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Staff", staffSchema);
