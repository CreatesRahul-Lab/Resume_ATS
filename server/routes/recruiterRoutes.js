import express from "express";

const router = express.Router();

// Bulk Resume Analysis
router.post("/analyze", (req, res) => {
  const { resumes } = req.body;
  const analyzedData = resumes.map((resume) => ({
    resume,
    status: "Analyzed",
  }));
  res.json(analyzedData);
});

export default router;
