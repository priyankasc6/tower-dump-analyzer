const express = require('express');
const router = express.Router();
const AuditLog = require('../models/AuditLog');

router.get('/', async (req, res) => {
  try {
    const logs = await AuditLog.find().sort({ timestamp: -1 }).limit(50);
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get('/:caseId', async (req, res) => {
  try {
    const logs = await AuditLog.find({ caseId: req.params.caseId }).sort({ timestamp: -1 });
    res.json(logs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;