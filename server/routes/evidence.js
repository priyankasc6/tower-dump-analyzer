const express = require('express');
const router = express.Router();
const multer = require('multer');
const XLSX = require('xlsx');
const Evidence = require('../models/Evidence');
const AuditLog = require('../models/AuditLog');

const upload = multer({ storage: multer.memoryStorage() });

// Upload evidence file
router.post('/upload', upload.single('file'), async (req, res) => {
  try {
    const { caseId, towerLocation, towerLat, towerLng, uploadedBy } = req.body;

    const workbook = XLSX.read(req.file.buffer, { type: 'buffer' });
    const sheet = workbook.Sheets[workbook.SheetNames[0]];
    const rows = XLSX.utils.sheet_to_json(sheet);

    const records = rows.map(row => ({
      msisdn: String(row.msisdn || row.MSISDN || row.number || ''),
      timestamp: new Date(row.timestamp || row.Timestamp || row.time || Date.now()),
      towerId: row.towerId || row.tower_id || towerLocation,
      location: towerLocation
    }));

    const evidence = new Evidence({
      caseId,
      fileName: req.file.originalname,
      towerLocation,
      towerLat: parseFloat(towerLat),
      towerLng: parseFloat(towerLng),
      uploadedBy,
      records,
      totalRecords: records.length
    });

    await evidence.save();

    await AuditLog.create({
      action: 'EVIDENCE_UPLOADED',
      caseId,
      analyst: uploadedBy,
      details: `File "${req.file.originalname}" uploaded — ${records.length} records parsed`
    });

    res.status(201).json({
      message: 'Evidence uploaded successfully',
      totalRecords: records.length,
      evidenceId: evidence._id
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get all evidence for a case
router.get('/:caseId', async (req, res) => {
  try {
    const evidence = await Evidence.find(
      { caseId: req.params.caseId },
      { records: 0 }
    );
    res.json(evidence);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;