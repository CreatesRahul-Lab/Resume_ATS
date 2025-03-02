// server.js
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
import linkedinRoutes from "./routes/linkedinRoutes.js";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(express.json());
app.use(cors());

// Fix Mongoose deprecation warning
mongoose.set("strictQuery", true);

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log("✅ MongoDB connected successfully");
  } catch (error) {
    console.error("❌ MongoDB connection error:", error);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/resume", resumeRoutes);
app.use("/api/payment", paymentRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api/optimize", optimizationRoutes);
app.use("/api/recruiter", recruiterRoutes);
app.use("/api/cloud", cloudRoutes);
app.use("/api/linkedin", linkedinRoutes);

// Basic Route
app.get("/", (req, res) => {
  res.send("ATS Resume Builder API is running");
});

// Start Server
let currentPort = PORT;

const startServer = () => {
  const server = app.listen(currentPort, () => {
    console.log(`🚀 Server running on http://localhost:${currentPort}`);
  });

  // Handle EADDRINUSE error
  server.on("error", (err) => {
    if (err.code === "EADDRINUSE") {
      console.error(
        `⚠️ Port ${currentPort} is already in use. Trying port ${
          currentPort + 1
        }...`
      );
      currentPort++;
      startServer();
    } else {
      console.error("❌ Unexpected Error:", err);
      process.exit(1);
    }
  });
};

startServer();

// Graceful shutdown
process.on("SIGINT", async () => {
  console.log("🛑 Graceful shutdown initiated");
  await mongoose.disconnect();
  console.log("✅ MongoDB disconnected");
  process.exit(0);
});

// Catch unhandled promise rejections
process.on("unhandledRejection", (error) => {
  console.error("❌ Unhandled Rejection:", error);
  process.exit(1);
});
