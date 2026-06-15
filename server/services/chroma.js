import { ChromaClient } from "chromadb";
import dotenv from 'dotenv';

dotenv.config()

const client = new ChromaClient({
  host: process.env.CHROMA_URL,
  ssl: true,
});

export default client;