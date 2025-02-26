import express from "express";
import multer from "multer";
import cloudinary from "cloudinary";
import { Resume } from "../models/Resume.js";

const router = express.Router();

cloudinary.v2.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const upload = multer({ storage: multer.memoryStorage() });

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    const file = req.file;
    if (!file) return res.status(400).json({ error: "No file uploaded" });

    const result = await cloudinary.v2.uploader.upload_stream(
      {
        resource_type: "auto",
      },
      async (error, result) => {
        if (error) return res.status(500).json({ error: "Upload failed" });

        const resume = new Resume({
          user: req.user.id,
          content: {},
          cloudinaryUrl: result.secure_url,
        });
        await resume.save();

        res.json({ success: true, url: result.secure_url });
      }
    );

    result.end(file.buffer);
  } catch (error) {
    console.error("Cloudinary Upload Error:", error);
    res.status(500).json({ error: "Upload failed" });
  }
});

export default router;
