
const express = require('express');
const router = express.Router();
const Case = require('../models/Case');
const AuditLog = require('../models/AuditLog');

// Get all cases
router.get('/', async (req, res) => {
  try {
    const cases = await Case.find().sort({ createdAt: -1 });
    res.json(cases);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get single case
router.get('/:caseId', async (req, res) => {
  try {
    const c = await Case.findOne({ caseId: req.params.caseId });
    if (!c) return res.status(404).json({ message: 'Case not found' });
    res.json(c);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Create case
router.post('/', async (req, res) => {
  try {
    const newCase = new Case(req.body);
    await newCase.save();
    await AuditLog.create({
      action: 'CASE_CREATED',
      caseId: newCase.caseId,
      analyst: req.body.analyst || 'Unknown',
      details: `Case "${newCase.title}" created`
    });
    res.status(201).json(newCase);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Update case status
router.patch('/:caseId', async (req, res) => {
  try {
    const updated = await Case.findOneAndUpdate(
      { caseId: req.params.caseId },
      req.body,
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;