const mongoose = require("mongoose");

const PaymentSchema = new mongoose.Schema({
  admissionNo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Student",
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["pending", "paid", "failed"],
    default: "pending",
  },
  method: {
    type: String,
    enum: ["credit_card", "debit_card", "upi", "net_banking"],
    required: true,
  },
  paymentIntentId: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("Payment", PaymentSchema);
