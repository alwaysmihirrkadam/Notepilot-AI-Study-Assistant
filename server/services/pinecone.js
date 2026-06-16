import { Pinecone } from '@pinecone-database/pinecone';
import dotenv from 'dotenv';

dotenv.config();

if (!process.env.PINECONE_API_KEY) {
  console.error("❌ Missing PINECONE_API_KEY inside environment configuration!");
}

// Instantiate the Pinecone cloud database client
const pc = new Pinecone({
  apiKey: process.env.PINECONE_API_KEY
});

// Target your index globally
const index = pc.index('notepilot-index');

export default index;