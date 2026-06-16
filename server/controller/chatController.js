import { GoogleGenAI } from "@google/genai";
import Document from "../models/Document.js";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const askDocumentQuestion = async (req, res) => {
  try {
    const { documentId, question } = req.body;

    // 1. Fetch the full original extracted text straight out of MongoDB
    const doc = await Document.findOne({ documentId });
    if (!doc) {
      return res.status(404).json({ success: false, error: "Document not found" });
    }

    // 2. Build a prompt context injection payload for Gemini
    const systemPrompt = `You are an expert study assistant. Answer the user's question using only the provided document text context below. If the answer cannot be found in the context, politely state that it isn't mentioned.
    
    --- START OF DOCUMENT CONTEXT ---
    ${doc.extractedText}
    --- END OF DOCUMENT CONTEXT ---`;

    // 3. Request content generation natively from Gemini 
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash", // Excellent for long contextual understanding
      contents: [
        { role: "user", parts: [{ text: `${systemPrompt}\n\nQuestion: ${question}` }] }
      ]
    });

    return res.status(200).json({
      success: true,
      answer: response.text
    });

  } catch (error) {
    console.error("❌ Chat Controller Error:", error);
    return res.status(500).json({ success: false, error: error.message });
  }
};