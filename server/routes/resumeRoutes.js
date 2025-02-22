import express from "express";
import multer from "multer";
import Resume from "../models/Resume.js";
import { parseResume } from "../utils/parseResume.js";

const router = express.Router();
const upload = multer();

// Upload Resume with Parsing
router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const { userId } = req.body;
    const content = req.file.buffer.toString("utf-8");
    const parsedData = await parseResume(req.file.buffer);

    const resume = await Resume.create({ user: userId, content, parsedData });
    res.status(201).json(resume);
  } catch (error) {
    res.status(500).json({ message: "Error uploading resume" });
  }
});

// Get User Resumes
router.get("/:userId", async (req, res) => {
  try {
    const resumes = await Resume.find({ user: req.params.userId });
    res.status(200).json(resumes);
  } catch (error) {
    res.status(500).json({ message: "Error fetching resumes" });
  }
});

export default router;
