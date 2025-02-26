import express from "express";
import { fetchLinkedInJobs } from "../utils/linkedinApi.js";
import Resume from "../models/Resume.js";

const router = express.Router();

// Search jobs on LinkedIn based on resume
router.post("/linkedin/search", async (req, res) => {
  try {
    const { resumeId } = req.body;

    // Retrieve parsed resume
    const resume = await Resume.findById(resumeId);
    if (!resume) return res.status(404).json({ error: "Resume not found" });

    const { skills } = resume.parsedData;
    if (!skills || skills.length === 0) {
      return res.status(400).json({ error: "No skills found in resume" });
    }

    // Fetch jobs using LinkedIn API
    const jobs = await fetchLinkedInJobs(skills.join(", "));

    res.json({ success: true, jobs });
  } catch (error) {
    console.error("LinkedIn Job Search Error:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
  