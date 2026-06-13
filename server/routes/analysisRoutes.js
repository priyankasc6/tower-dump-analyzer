const express = require("express");
const router = express.Router();
const TowerDump = require("../models/TowerDump");

router.get("/common-numbers", async (req, res) => {
  try {

    const result = await TowerDump.aggregate([
      {
        $group: {
          _id: "$mobileNumber",
          count: { $sum: 1 }
        }
      },
      {
        $match: {
          count: { $gt: 1 }
        }
      }
    ]);

    res.json(result);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/all", async (req, res) => {
  try {
    const data = await TowerDump.find({});
    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

router.get("/clear", async (req, res) => {
  await TowerDump.deleteMany({});
  res.json({ message: "Cleared" });
});

router.get("/suspects", async (req, res) => {

 const suspects = await TowerDump.aggregate([
   {
     $group:{
       _id:"$mobileNumber",
       appearances:{ $sum:1 }
     }
   },
   {
     $sort:{
       appearances:-1
     }
   }
 ]);

 res.json(suspects);
});

router.get("/movement/:number", async (req, res) => {
  try {
    const data = await TowerDump.find({
      mobileNumber: req.params.number
    }).sort({ timestamp: 1 });

    res.json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;