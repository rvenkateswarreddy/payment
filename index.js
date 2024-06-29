const express = require("express");
const cors = require("cors");
// const mongoose = require("mongoose");

require("dotenv").config();

const connectDB = require("./config/db");

const app = express();
app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-auth-token"],
    credentials: true,
  })
);

app.use(express.json());
// Connect to MongoDBa
connectDB();

// Init Middleware

// Define Routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/students", require("./routes/students"));
// app.use("/api/payments", require("./routes/payments"));
// app.use("/api/courses", require("./routes/courses"));
// app.use("/api/reports", require("./routes/reports"));

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
