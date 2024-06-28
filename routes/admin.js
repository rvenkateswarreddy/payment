// routes/admin.js
const express = require("express");
const router = express.Router();
const {
  getAllStudents,
  getStudentById,
  updateStudentById,
  deleteStudentById,
  addStudent,
} = require("../controllers/adminStudentController");
const {
  getAllPayments,
  getPaymentById,
  updatePaymentById,
} = require("../controllers/adminPaymentController");
const {
  getAllCourses,
  getCourseById,
  updateCourseById,
  addCourse,
} = require("../controllers/adminCourseController");
const { getDashboard } = require("../controllers/adminDashboardController");
const {
  getFeeCollectionReport,
  getFeeStatusReport,
  generateCustomReport,
} = require("../controllers/adminReportsController");

// Middleware for admin authentication
const { adminAuth } = require("../middleware/auth");

// Student routes
router.get("/students", adminAuth, getAllStudents);
router
  .route("/students/:admissionNo")
  .get(adminAuth, getStudentById)
  .put(adminAuth, updateStudentById)
  .delete(adminAuth, deleteStudentById);
router.post("/students/add", adminAuth, addStudent);

// Payment routes
router.get("/payments", adminAuth, getAllPayments);
router
  .route("/payments/:paymentId")
  .get(adminAuth, getPaymentById)
  .put(adminAuth, updatePaymentById);

// Course routes
router.get("/courses", adminAuth, getAllCourses);
router
  .route("/courses/:courseId")
  .get(adminAuth, getCourseById)
  .put(adminAuth, updateCourseById);
router.post("/courses/add", adminAuth, addCourse);

// Dashboard route
router.get("/dashboard", adminAuth, getDashboard);

// Report routes
router.get("/reports/fee-collection", adminAuth, getFeeCollectionReport);
router.get("/reports/fee-status", adminAuth, getFeeStatusReport);
router.post("/reports/custom", adminAuth, generateCustomReport);

module.exports = router;
