import express from "express";
import upload from "../middleware/upload.js";
import authMiddleware from "../middleware/authMiddleware.js";
import { uploadPDF } from "../controller/uploadController.js";

const router = express.Router();

router.post(
  "/upload",
  authMiddleware,
  upload.single("pdf"),
  uploadPDF
);

export default router;