const Student = require("../models/Student");
const Payment = require("../models/Payment");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);
const { validationResult } = require("express-validator");

// @route   GET api/students/dashboard
// @desc    Retrieve student dashboard data (profile, payment details, history)
// @access  Private (Student)
exports.getStudentDashboard = async (req, res) => {
  try {
    const student = await Student.findById(req.student.id).select("-password");
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
    const student = await Student.findById(req.student.id).select("-password");
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
    let student = await Student.findById(req.student.id);

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
    const payments = await Payment.find({ admissionNo: req.student.id });
    res.json(payments);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   POST api/students/payments/make
// @desc    Initiate payment via payment gateway (Stripe/Razorpay)
// @access  Private (Student)
exports.makePayment = async (req, res) => {
  const { amount, paymentMethod } = req.body;

  try {
    const paymentIntent = await stripe.paymentIntents.create({
      amount: amount * 100, // Convert to smallest currency unit
      currency: "inr",
      payment_method_types: [paymentMethod],
    });

    const payment = new Payment({
      admissionNo: req.student.id,
      amount,
      status: "pending",
      method: paymentMethod,
      paymentIntentId: paymentIntent.id,
      date: Date.now(),
    });

    await payment.save();

    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
