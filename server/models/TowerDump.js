const mongoose = require("mongoose");

const towerDumpSchema = new mongoose.Schema({
  caseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Case"
  },

  mobileNumber: String,
  towerId: String,
  timestamp: Date,

  latitude: Number,
  longitude: Number
});

module.exports = mongoose.model("TowerDump", towerDumpSchema);