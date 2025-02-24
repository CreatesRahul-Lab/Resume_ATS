// server/server.js

import express from "express";
import dotenv from "dotenv";
import mongoose from "mongoose";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import resumeRoutes from "./routes/resumeRoutes.js";
import paymentRoutes from "./routes/paymentRoutes.js";
import jobRoutes from "./routes/jobRoutes.js";
import optimizationRoutes from "./routes/optimizationRoutes.js";
import recruiterRoutes from "./routes/recruiterRoutes.js";
import cloudRoutes from "./routes/cloudRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("✅ MongoDB Connected"))
  .catch((err) => console.error("❌ MongoDB Connection Error:", err));

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/optimize", optimizationRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/cloud", cloudRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("ATS Resume Builder API is running");
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
