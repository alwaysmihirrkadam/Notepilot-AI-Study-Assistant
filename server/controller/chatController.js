import client from "../services/chroma.js";
import { generateEmbedding } from "../services/embeddingService.js";
import genAI from "../services/gemini.js";

export const askQuestion = async (req, res) => {
  try {
    const { question, documentId } = req.body;
    if (!question || !documentId) {
      return res.status(400).json({
        success: false,
        message: "Question and documentId are required",
      });
    }

    const collection = await client.getCollection({
      name: "study-notes",
    });

    const questionEmbedding = await generateEmbedding(question);


    // TEMPORARY: QUERY WITHOUT FILTER
    const results =
      await collection.query({
        queryEmbeddings: [
          questionEmbedding,
        ],
        nResults: 3,
        where: {
          documentId,
        },
      });

    if (
      !results.documents ||
      !results.documents[0] ||
      results.documents[0].length === 0
    ) {
      return res.status(404).json({
        success: false,
        message:
          "No relevant content found",
      });
    }

    const context =
      results.documents[0].join(
        "\n\n"
      );

    const model =
      genAI.getGenerativeModel({
        model: "gemini-2.5-flash",
      });
    const prompt = `
You are a study assistant.

Use ONLY the provided context.

If the answer is not present in the context,
say:

"I could not find that information in the uploaded document."

Context:
${context}

Question:
${question}
`;

    const response = await model.generateContent(prompt);

    const answer = response.response.text();

    return res.status(200).json({
      success: true,
      answer,
      sources: results.documents[0].map(
        (doc, index) => ({
          text: doc,
          metadata:
            results.metadatas?.[0]?.[
            index
            ] || {},
        })
      ),
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};