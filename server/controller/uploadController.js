import fs from "fs-extra";
import { randomUUID } from "crypto";
import { extractTextFromPDF } from "../services/pdfProcessor.js";
import Document from "../models/Document.js";
import cloudinary from "../services/cloudinary.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: "No file uploaded" });
    }

    // 1. Upload raw PDF file to Cloudinary for storage access links
    const uploadedFile = await cloudinary.uploader.upload(req.file.path, {
      resource_type: "raw",
      folder: "study-assistant",
    });
    
    const pdfUrl = uploadedFile.secure_url;
    const publicId = uploadedFile.public_id;

    // 2. Extract full text from local temporary storage path
    const text = await extractTextFromPDF(req.file.path);
    await fs.remove(req.file.path); // Clean up temp file instantly

    if (!text || text.trim().length < 10) {
      return res.status(400).json({
        success: false,
        error: "Could not extract text. Ensure the PDF is text-based and not an image.",
      });
    }

    const documentId = randomUUID();
    const userId = req.user.id;
    const filename = req.file.originalname;

    // 3. Save directly to your working MongoDB database
    const newDoc = await Document.create({
      documentId,
      filename,
      pdfUrl,
      publicId,
      userId,
      extractedText: text, // Storing full text directly 
    });


    return res.status(200).json({
      success: true,
      documentId,
      filename,
      pdfUrl,
      message: "Document uploaded and parsed successfully!"
    });

  } catch (error) {
    console.error("❌ Vector-Free Upload Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};