import fs from "fs";
import { createRequire } from "module";

const require = createRequire(import.meta.url);
const pdf = require("pdf-parse-fork");

export const extractTextFromPDF = async (filePath) => {
  try {
    const dataBuffer = fs.readFileSync(filePath);
    const data = await pdf(dataBuffer);
    return data && data.text ? data.text : "";
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};