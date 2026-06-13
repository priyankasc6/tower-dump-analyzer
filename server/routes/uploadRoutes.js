const express = require("express");
const router = express.Router();
const multer = require("multer");
const XLSX = require("xlsx");

const TowerDump = require("../models/TowerDump");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/");
  },

  filename: function (req, file, cb) {
    cb(null, Date.now() + "-" + file.originalname);
  }
});

const upload = multer({ storage });

router.post("/", upload.single("file"), async (req, res) => {
  try {

    const workbook = XLSX.readFile(req.file.path);

    const sheetName = workbook.SheetNames[0];

    const data = XLSX.utils.sheet_to_json(
      workbook.Sheets[sheetName]
    );

    console.log(data);

    const formattedData = data.map(row => ({
     mobileNumber: row.mobileNumber,
     towerId: row.towerId,
     timestamp: new Date((row.timestamp - 25569) * 86400 * 1000),
     latitude: row.latitude,
     longitude: row.longitude
    }));

    await TowerDump.insertMany(formattedData);

    res.json({
      success: true,
      count: data.length
    });

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});

module.exports = router;