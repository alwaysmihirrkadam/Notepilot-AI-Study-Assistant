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

// Configure CORS to trust your deployed Vercel frontend
const allowedOrigins = [
  "http://localhost:5173", // Your local Vite dev environment
  "http://localhost:3000", // Alternative local dev port fallback
  "https://notepilot-ai-study-assistant.vercel.app" // 🔥 Your official live Vercel frontend
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, Postman, or curl)
      if (!origin) return callback(null, true);
      
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true);
      } else {
        console.log(`⚠️ Blocked by CORS: ${origin}`);
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true, // Allows HTTP cookies or Authorization headers if needed
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Handling preflight requests globally
app.options("*", cors());
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