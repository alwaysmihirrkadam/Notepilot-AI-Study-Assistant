import mongoose from "mongoose";

const documentSchema = new mongoose.Schema({
  documentId: {
    type: String,
    required: true,
  },

  filename: {
    type: String,
    required: true,
  },

  pdfUrl: {
    type: String,
    required: true,
  },
  
  publicId: {
    type: String,
    required: true,
  },

  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },

  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model(
  "Document",
  documentSchema
);