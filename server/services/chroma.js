import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  path: process.env.CHROMA_URL,
});

export default client;