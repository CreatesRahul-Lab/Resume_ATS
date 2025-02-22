import express from "express";
import Job from "../models/Job.js";

const router = express.Router();

// Get All Jobs
router.get("/", async (req, res) => {
  try {
    const jobs = await Job.find();
    res.status(200).json(jobs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching jobs" });
  }
});

export default router;
