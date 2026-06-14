const mongoose = require('mongoose');

const RecordSchema = new mongoose.Schema({
  msisdn: String,
  timestamp: Date,
  towerId: String,
  location: String,
});

const EvidenceSchema = new mongoose.Schema({
  caseId: { type: String, required: true },
  fileName: { type: String },
  towerLocation: { type: String },
  towerLat: { type: Number },
  towerLng: { type: Number },
  uploadedBy: { type: String },
  uploadedAt: { type: Date, default: Date.now },
  records: [RecordSchema],
  totalRecords: { type: Number, default: 0 }
});

module.exports = mongoose.model('Evidence', EvidenceSchema);