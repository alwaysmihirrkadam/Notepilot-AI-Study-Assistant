import { ChromaClient } from "chromadb";
import dotenv from 'dotenv';

dotenv.config()

const client = new ChromaClient({
  path: process.env.CHROMA_URL,
});

export default client;