// D:\NotePilot\server\services\embeddingService.js
import { GoogleGenAI } from "@google/genai";
import dotenv from "dotenv";

// Ensure your environment variables are loaded immediately inside this module
dotenv.config();

const apiKey = process.env.GEMINI_API_KEY || process.env.GOOGLE_API_KEY;

if (!apiKey) {
  console.error("❌ CRITICAL: No API key found in process.env.GEMINI_API_KEY");
}

const ai = new GoogleGenAI({ 
  apiKey: apiKey 
});

export const generateEmbedding = async (text) => {
  try {
    const cleanText = text ? String(text).trim() : "";
    if (!cleanText) return [];

    // FIX: Prepend 'models/' so the v1beta router knows exactly where to look
    const response = await ai.models.embedContent({
      model: "models/text-embedding-004", 
      contents: cleanText,         
    });

    if (response && response.embedding && response.embedding.values) {
      return response.embedding.values;
    }
    
    throw new Error("Unexpected response structural shape from Gemini API");
  } catch (error) {
    console.error("Embedding generation error:", error);
    throw error;
  }
};