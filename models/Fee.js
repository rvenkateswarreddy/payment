const mongoose = require("mongoose");

const FeeSchema = new mongoose.Schema({
  studentfeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  categoryName: {
    type: String,
    required: true,
  },

  categoryId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category", // Assuming you have a Category model
    required: true,
  },
  totalFees: { type: Number, required: true },
  pendingFees: { type: Number, required: true },
  paidFees: { type: Number, required: true },
});

module.exports = mongoose.model("Fee", FeeSchema);
