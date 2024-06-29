const Student = require("../models/Student");
const Payment = require("../models/Payment");
const Razorpay = require("razorpay");
const { validationResult } = require("express-validator");

// Initialize Razorpay instance
const razorpay = new Razorpay({
  key_id: "rzp_test_KStLt14203VFVn",
  key_secret: "Od2TZxpkVAXRQhxogFzzN3Nf",
});

// @route   GET api/students/dashboard
// @desc    Retrieve student dashboard data (profile, payment details, history)
// @access  Private (Student)
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.user.id).select("-password");
    const payments = await Payment.find({ admissionNo: req.student.id });

    const totalAmount = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const paidAmount = payments
      .filter((payment) => payment.status === "paid")
      .reduce((acc, payment) => acc + payment.amount, 0);
    const pendingAmount = totalAmount - paidAmount;

    res.json({
      profile: student,
      payments: {
        totalAmount,
        paidAmount,
        pendingAmount,
        history: payments,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/students/profile
// @desc    Get student profile information
// @access  Private (Student)
exports.getStudentProfile = async (req, res) => {
  try {
    console.log("req.user:", req.user); // Log the req.user object
    const student = await Student.findById(req.user.id).select("-password");
    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }
    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/students/profile
// @desc    Update student profile information
// @access  Private (Student)
exports.updateStudentProfile = async (req, res) => {
  const { name, email, phone } = req.body;

  // Build student object
  const studentFields = {};
  if (name) studentFields.name = name;
  if (email) studentFields.email = email;
  if (phone) studentFields.phone = phone;

  try {
    let student = await Student.findById(req.user.id);

    if (!student) {
      return res.status(404).json({ msg: "Student not found" });
    }

    student = await Student.findByIdAndUpdate(
      req.student.id,
      { $set: studentFields },
      { new: true }
    );

    res.json(student);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/students/payments
// @desc    Get payment details (total amount, paid amount, pending amount)
// @access  Private (Student)
exports.getPaymentDetails = async (req, res) => {
  try {
    const payments = await Payment.find({ admissionNo: req.user.id });

    const totalAmount = payments.reduce(
      (acc, payment) => acc + payment.amount,
      0
    );
    const paidAmount = payments
      .filter((payment) => payment.status === "paid")
      .reduce((acc, payment) => acc + payment.amount, 0);
    const pendingAmount = totalAmount - paidAmount;

    res.json({
      totalAmount,
      paidAmount,
      pendingAmount,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/students/payments/history
// @desc    Get payment history
// @access  Private (Student)
exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ admissionNo: req.user.id });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

exports.makePayment = async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    // Validate input
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    if (!amount || !paymentMethod) {
      return res
        .status(400)
        .json({ msg: "Amount and payment method are required" });
    }

    // Create Razorpay order
    const options = {
      amount: amount * 100, // Convert to smallest currency unit
      currency: "INR",
      receipt: `payment_${Date.now()}`,
      payment_capture: 1, // Auto-capture payment
    };

    // Add payment method specifics
    if (paymentMethod) {
      options["method"] = paymentMethod;
    }

    const response = await razorpay.orders.create(options);

    // Save payment details to database
    const payment = new Payment({
      admissionNo: req.user.id,
      amount,
      status: "pending",
      method: paymentMethod || "Razorpay", // Default to Razorpay if no specific method
      paymentIntentId: response.id,
      date: Date.now(),
    });

    await payment.save();

    res.json({
      orderId: response.id,
      amount: response.amount / 100, // Convert back to actual currency
      currency: response.currency,
      receipt: response.receipt,
      clientSecret: "", // No client secret needed for Razorpay
    });
  } catch (err) {
    console.error("Error in makePayment:", err.message); // Log the error message
    res.status(500).send("Server Error");
  }
};
