const express = require('express');
const router = express.Router();
const Evidence = require('../models/Evidence');
const AuditLog = require('../models/AuditLog');

router.get('/:caseId', async (req, res) => {
  try {
    const evidenceList = await Evidence.find({ caseId: req.params.caseId });

    if (evidenceList.length < 2) {
      return res.status(400).json({ message: 'Need at least 2 evidence files to correlate' });
    }

    // Get number sets for each dump
    const sets = evidenceList.map(e => ({
      location: e.towerLocation,
      lat: e.towerLat,
      lng: e.towerLng,
      numbers: new Set(e.records.map(r => r.msisdn))
    }));

    // Find numbers common to ALL dumps
    let common = new Set(sets[0].numbers);
    for (let i = 1; i < sets.length; i++) {
      common = new Set([...common].filter(n => sets[i].numbers.has(n)));
    }

    // Build suspect profiles with movement timeline
    const suspects = [...common].map(msisdn => {
      const appearances = evidenceList.map(e => {
        const record = e.records.find(r => r.msisdn === msisdn);
        return {
          location: e.towerLocation,
          lat: e.towerLat,
          lng: e.towerLng,
          timestamp: record ? record.timestamp : null
        };
      }).sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));

      return { msisdn, appearances, totalLocations: appearances.length };
    });

    await AuditLog.create({
      action: 'CORRELATION_RUN',
      caseId: req.params.caseId,
      analyst: 'System',
      details: `Correlation complete — ${suspects.length} common numbers found across ${evidenceList.length} dumps`
    });

    res.json({
      caseId: req.params.caseId,
      totalDumps: evidenceList.length,
      commonCount: suspects.length,
      suspects
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;