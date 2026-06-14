const mongoose = require('mongoose');

const CaseSchema = new mongoose.Schema({
  caseId: { type: String, unique: true },
  title: { type: String, required: true },
  description: { type: String },
  location: { type: String },
  incidentDate: { type: Date },
  status: { type: String, enum: ['ACTIVE', 'REVIEW', 'CLOSED'], default: 'ACTIVE' },
  analyst: { type: String },
  createdAt: { type: Date, default: Date.now }
});

CaseSchema.pre('save', async function() {
  if (!this.caseId) {
    const count = await mongoose.model('Case').countDocuments();
    this.caseId = `CT-${String(count + 1).padStart(4, '0')}`;
  }
});

module.exports = mongoose.model('Case', CaseSchema);