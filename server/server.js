import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

// 🔥 CRITICAL FIX: Initialize your Express application here!
const app = express();


const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://notepilot-ai-study-assistant.vercel.app"
];

app.use(
  cors({
    origin: function (origin, callback) {
      // 1. Allow requests with no origin (like mobile apps or Postman)
      if (!origin) return callback(null, true);
      
      // 2. Allow if it matches our exact hardcoded production origins list
      if (allowedOrigins.indexOf(origin) !== -1) {
        return callback(null, true);
      }
      
      // 3. 🔥 FIX: Dynamic check to allow ANY Vercel branch/preview subdomains safely
      if (origin.endsWith(".vercel.app")) {
        return callback(null, true);
      }
      
      // If it doesn't match any of the rules, block it securely
      console.log(`⚠️ Blocked by CORS: ${origin}`);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);



// Handling preflight requests globally
app.options(/(.*)/, cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("NotePilot API Running Successfully");
});

app.use("/api/pdf", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents", documentRoutes);
app.use("/api/auth", userRoute);

// Render automatically injects process.env.PORT, fallback to 10000 locally if not set
const port = process.env.PORT || 10000;

const startServer = async () => {
  try {
    await connectDB();
    // 💡 FIX: Added '0.0.0.0' to ensure flawless container binding on Render
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running securely on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();