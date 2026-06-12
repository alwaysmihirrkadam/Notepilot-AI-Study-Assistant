import { pipeline } from "@xenova/transformers";

let extractor = null;

export const generateEmbedding = async (text) => {
  try {
    if (!extractor) {
      extractor = await pipeline(
        "feature-extraction",
        "Xenova/all-MiniLM-L6-v2"
      );
    }

    const output = await extractor(text, {
      pooling: "mean",
      normalize: true,
    });

    return Array.from(output.data);

  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};