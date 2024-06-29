// middleware/auth.js

const jwt = require("jsonwebtoken");

// Admin Authentication Middleware
exports.adminAuth = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    const decoded = jwt.verify(token, "payment");
    if (decoded.user.role !== "admin") {
      return res.status(403).json({ msg: "Access denied, not an admin" });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    res.status(401).json({ msg: "Token is not valid" });
  }
};

// Student Authentication Middleware
exports.studentAuth = function (req, res, next) {
  const token = req.header("x-auth-token");

  if (!token) {
    return res.status(401).json({ msg: "No token, authorization denied" });
  }

  try {
    console.log("Token:", token); // Log the token
    const decoded = jwt.verify(token, "payment");
    console.log("Decoded Payload:", decoded); // Log the decoded payload

    if (decoded.user.role !== "student") {
      return res.status(403).json({ msg: "Access denied, not a student" });
    }
    req.user = decoded.user;
    next();
  } catch (err) {
    console.error("JWT Error:", err); // Log the error
    res.status(401).json({ msg: "Token is not valid" });
  }
};
