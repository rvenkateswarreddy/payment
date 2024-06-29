const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const Student = require("../models/Student");
const Course = require("../models/Course");
// Student signup
exports.signup = async (req, res) => {
  const { name, admissionNo, courseName, email, phone, password } = req.body;

  try {
    let student = await Student.findOne({ admissionNo });

    if (student) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Student already exists" }] });
    }

    const course = await Course.findOne({ name: courseName });
    if (!course) {
      return res.status(400).json({ errors: [{ msg: "Invalid course name" }] });
    }

    student = new Student({
      name,
      admissionNo,
      courseName: course.name,
      email,
      phone,
      password,
    });

    const salt = await bcrypt.genSalt(10);
    student.password = await bcrypt.hash(password, salt);

    await student.save();

    const payload = {
      user: {
        id: student.id,
        role: "student", // Ensure the role is included in the payload
      },
    };

    jwt.sign(payload, "payment", { expiresIn: "5 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// Student login
exports.login = async (req, res) => {
  const { admissionNo, password } = req.body;

  try {
    let student = await Student.findOne({ admissionNo });

    if (!student) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const isMatch = await bcrypt.compare(password, student.password);

    if (!isMatch) {
      return res.status(400).json({ errors: [{ msg: "Invalid Credentials" }] });
    }

    const payload = {
      user: {
        id: student.id,
        role: "student", // Ensure the role is included in the payload
      },
    };

    jwt.sign(payload, "payment", { expiresIn: "5 days" }, (err, token) => {
      if (err) throw err;
      res.json({ token });
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
