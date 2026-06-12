import { RecursiveCharacterTextSplitter } from "@langchain/textsplitters";

export const splitTextIntoChunks = async (text) => {
  if (!text || typeof text !== "string") {
    return [];
  }

  const splitter =
  new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    chunkOverlap: 100,
  });

  const docs = await splitter.createDocuments([text]);

  return docs;
};