const express = require("express");
const router = express.Router();
const { signup, login } = require("../controllers/authController");
const {
  adminLogin,
  adminSignup,
} = require("../controllers/adminAuthController");

// @route   POST api/auth/signup
// @desc    Register new users (students)
// @access  Public
router.post("/signup", signup);

// @route   POST api/auth/login
// @desc    Authenticate users (students and admins) and issue JWT
// @access  Public
router.post("/login", login);

// @route   POST api/auth/admin/signup
// @desc    Register new admin users
// @access  Public
router.post("/admin/signup", adminSignup);

// @route   POST api/auth/admin/login
// @desc    Authenticate admin users and issue JWT
// @access  Public
router.post("/admin/login", adminLogin);

module.exports = router;
