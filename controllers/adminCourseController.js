const Course = require("../models/Course");
const { validationResult } = require("express-validator");

// @route   GET api/admin/courses
// @desc    Retrieve all courses
// @access  Private (Admin)
exports.getAllCourses = async (req, res) => {
  try {
    const courses = await Course.find();
    res.json(courses);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// @route   GET api/admin/courses/:courseId
// @desc    Retrieve course by ID
// @access  Private (Admin)
exports.getCourseById = async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   PUT api/admin/courses/:courseId
// @desc    Update course by ID
// @access  Private (Admin)
exports.updateCourseById = async (req, res) => {
  const { name, fee } = req.body;

  // Build course object
  const courseFields = {};
  if (name) courseFields.name = name;
  if (fee) courseFields.fee = fee;

  try {
    let course = await Course.findById(req.params.courseId);

    if (!course) {
      return res.status(404).json({ msg: "Course not found" });
    }

    course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { $set: courseFields },
      { new: true }
    );

    res.json(course);
  } catch (err) {
    console.error(err.message);
    if (err.kind === "ObjectId") {
      return res.status(404).json({ msg: "Course not found" });
    }
    res.status(500).send("Server Error");
  }
};

// @route   POST api/admin/courses/add
// @desc    Add a new course
// @access  Private (Admin)
exports.addCourse = async (req, res) => {
  const { name, fee } = req.body;

  try {
    let course = await Course.findOne({ name });

    if (course) {
      return res
        .status(400)
        .json({ errors: [{ msg: "Course already exists" }] });
    }

    course = new Course({
      name,
      fee,
    });

    await course.save();

    res.json(course);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};
