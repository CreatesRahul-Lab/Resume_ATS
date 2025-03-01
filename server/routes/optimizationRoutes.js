

import express from "express";
const router = express.Router();


router.post("/", (req, res) => {
  const { content } = req.body;
 
  const optimizedResume = `${content}\n\n[Optimized for ATS]`;
  res.json({ optimizedResume });
});

export default router;
