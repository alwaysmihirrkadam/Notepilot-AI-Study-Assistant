import { ChromaClient } from "chromadb";

const client = new ChromaClient({
  host: process.env.CHROMA_HOST,
  ssl: true,
});

export default client;