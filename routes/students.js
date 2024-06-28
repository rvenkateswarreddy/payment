const express = require("express");
const router = express.Router();
const {
  getStudentDashboard,
  getStudentProfile,
  updateStudentProfile,
  getPaymentDetails,
  getPaymentHistory,
  makePayment,
} = require("../controllers/studentController");

// Middleware for student authentication
const { studentAuth } = require("../middleware/auth");

// @route   GET api/students/dashboard
// @desc    Retrieve student dashboard data (profile, payment details, history)
// @access  Private (Student)
router.get("/dashboard", studentAuth, getStudentDashboard);

// @route   GET api/students/profile
// @desc    Get student profile information
// @access  Private (Student)
router.get("/profile", studentAuth, getStudentProfile);

// @route   PUT api/students/profile
// @desc    Update student profile information
// @access  Private (Student)
router.put("/profile", studentAuth, updateStudentProfile);

// @route   GET api/students/payments
// @desc    Get payment details (total amount, paid amount, pending amount)
// @access  Private (Student)
router.get("/payments", studentAuth, getPaymentDetails);

// @route   GET api/students/payments/history
// @desc    Get payment history
// @access  Private (Student)
router.get("/payments/history", studentAuth, getPaymentHistory);

// @route   POST api/students/payments/make
// @desc    Initiate payment via payment gateway (Stripe/Razorpay)
// @access  Private (Student)
router.post("/payments/make", studentAuth, makePayment);

module.exports = router;
