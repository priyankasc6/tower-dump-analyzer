const mongoose = require('mongoose');

const AuditSchema = new mongoose.Schema({
  action: { type: String },
  caseId: { type: String },
  analyst: { type: String },
  details: { type: String },
  timestamp: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AuditLog', AuditSchema);