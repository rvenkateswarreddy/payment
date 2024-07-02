const express = require("express");
const router = express.Router();
const Fee = require("../models/Fee");

// Get fee details for a student
router.get("/:studentId", async (req, res) => {
  try {
    const fee = await Fee.findOne({ studentId: req.params.studentId });

    if (!fee) {
      return res.status(404).json({ msg: "Fee details not found" });
    }

    res.json(fee);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
