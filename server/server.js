import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./config/db.js";
import uploadRoutes from './routes/uploadRoutes.js';
import chatRoutes from './routes/chatRoutes.js';
import documentRoutes from './routes/documentRoutes.js';
import userRoute from './routes/userRoute.js';

dotenv.config();

const app = express();

// ==========================================
// 🔥 FOOLPROOF CORS & PREFLIGHT CONTROLLER
// ==========================================

// 1. Apply the standard cors middleware globally with flexible allowed origins
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:3000",
      "https://notepilot-ai-study-assistant.vercel.app"
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"]
  })
);

// 2. Heavy-duty custom middleware to intercept preflights and force headers
app.use((req, res, next) => {
  const origin = req.headers.origin;
  
  // Natively intercept the active Vercel production and preview subdomains
  if (origin && (origin === "https://notepilot-ai-study-assistant.vercel.app" || origin.endsWith(".vercel.app") || origin.startsWith("http://localhost"))) {
    res.setHeader("Access-Control-Allow-Origin", origin);
  }
  
  res.setHeader("Access-Control-Allow-Methods", "GET, HEAD, PUT, PATCH, POST, DELETE, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization, X-Requested-With");
  res.setHeader("Access-Control-Allow-Credentials", "true");

  // If the browser sends an OPTIONS preflight request, reply instantly with 200 OK!
  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }
  
  next();
});

// ==========================================
// STANDARD APPLICATION ROUTING CONFIGURATION
// ==========================================

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
    app.listen(port, '0.0.0.0', () => {
      console.log(`Server running securely on port ${port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error);
  }
};

startServer();