const mongoose = require("mongoose");

const CourseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    enum: ["MCA", "MBA", "MSC", "MCOM"],
  },
  fee: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Course = mongoose.model("Course", CourseSchema);

// Set fixed prices for each course
const coursePrices = {
  MCA: 10000,
  MBA: 12000,
  MSC: 9000,
  MCOM: 11000,
};

// Initialize courses with fixed prices
const initializeCourses = async () => {
  for (const [name, fee] of Object.entries(coursePrices)) {
    const course = await Course.findOne({ name });
    if (!course) {
      await Course.create({ name, fee });
    }
  }
};

// Call the function to initialize courses (you can also call this function from another script)
initializeCourses();

module.exports = Course;
