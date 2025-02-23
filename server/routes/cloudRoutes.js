import express from "express";
import multer from "multer";
import { uploadFileToS3 } from "../utils/cloudStorage.js";
import Resume from "../models/Resume.js";

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

// Endpoint to upload resume to cloud (AWS S3)
router.post("/upload", upload.single("resume"), async (req, res) => {
  try {
    const { file } = req;
    const fileName = `${Date.now()}-${file.originalname}`;

    const fileData = await uploadFileToS3(file.buffer, fileName);

    // Save file URL to the database
    const newResume = new Resume({
      user: req.body.userId, // Assuming the userId is passed in the body
      content: { url: fileData.Location },
      parsedData: {},
    });

    await newResume.save();
    res.json({
      message: "File uploaded successfully",
      fileData: fileData.Location,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

export default router;
