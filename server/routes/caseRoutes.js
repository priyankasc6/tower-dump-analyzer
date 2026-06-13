const express = require("express");
const router = express.Router();

const Case = require("../models/Case");


// Create Case

router.post("/", async (req, res) => {
  try {

    const newCase = new Case({
      caseName: req.body.caseName,
      location: req.body.location,
      description: req.body.description
    });

    const savedCase = await newCase.save();

    res.status(201).json(savedCase);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }
});


// Get All Cases

router.get("/", async (req, res) => {

  try {

    const cases = await Case.find();

    res.status(200).json(cases);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});


// Get Single Case

router.get("/:id", async (req, res) => {

  try {

    const singleCase = await Case.findById(req.params.id);

    res.status(200).json(singleCase);

  } catch (error) {

    res.status(500).json({
      message: error.message
    });

  }

});

module.exports = router;