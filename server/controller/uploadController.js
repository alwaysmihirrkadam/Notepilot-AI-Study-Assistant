import fs from "fs-extra";
import { randomUUID } from "crypto";

import { extractTextFromPDF } from "../services/pdfProcessor.js";
import { splitTextIntoChunks } from "../services/textSplitter.js";
import { generateEmbedding } from "../services/embeddingService.js";
import client from "../services/chroma.js";
import Document from "../models/Document.js";
import cloudinary from "../services/cloudinary.js";

export const uploadPDF = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        success: false,
        error: "No file uploaded",
      });
    }

    const uploadedFile = await cloudinary.uploader.upload(
      req.file.path,
      {
        resource_type: "raw",
        folder: "study-assistant",
      }
    );

    const pdfUrl = uploadedFile.secure_url;
    const publicId = uploadedFile.public_id;

    const text = await extractTextFromPDF(req.file.path);

    await fs.remove(req.file.path);

    if (!text || text.trim().length < 100) {
      return res.status(400).json({
        success: false,
        error: "Could not extract text from PDF",
      });
    }

    const chunks = await splitTextIntoChunks(text);

    const documentId = randomUUID();

    const collection =
      await client.getOrCreateCollection({
        name: "study-notes",
      });
    const userId = req.user.id;
    const filename = req.file.originalname;

    for (let i = 0; i < chunks.length; i++) {
      const embedding =
        await generateEmbedding(
          chunks[i].pageContent
        );

      await collection.add({
        ids: [`chunk-${documentId}-${i}`],

        embeddings: [embedding],

        documents: [
          chunks[i].pageContent,
        ],

        metadatas: [
          {
            source: filename,
            documentId,
            userId,
          },
        ],
      });
    }

    await Document.create({
      documentId,
      filename,
      pdfUrl,
      publicId,
      userId,
    });

    return res.status(200).json({
      success: true,
      documentId,
      filename,
      pdfUrl,
      totalChunks: chunks.length,
    });

  } catch (error) {
  console.error(error);

  return res.status(500).json({
    success: false,
    error: error.message,
  });
}
};