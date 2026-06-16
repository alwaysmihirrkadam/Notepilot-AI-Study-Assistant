import mongoose from 'mongoose';

const DocumentSchema = new mongoose.Schema({
  documentId: { type: String, required: true, unique: true },
  filename: { type: String, required: true },
  pdfUrl: { type: String, required: true },
  publicId: { type: String, required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  extractedText: { type: String, required: true }, // Added to hold the full text
  createdAt: { type: Date, default: Date.now }
});

export default mongoose.model('Document', DocumentSchema);