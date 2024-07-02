// backend/routes/paymentRoutes.js

const express = require("express");
const router = express.Router();

const {
  getPaymentDetails,
  fetchRecentPayments,
  getAllPayments,
} = require("../controllers/paymentController");

// Route to fetch payment details by payment ID
router.get("/payments/details/:paymentId", getPaymentDetails);
router.get("/payments/all", getAllPayments);
router.get("/payments/recent", fetchRecentPayments);

module.exports = router;
