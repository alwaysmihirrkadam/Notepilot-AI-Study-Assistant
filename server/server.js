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

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "https://notepilot-free-ai-study-assistant-460sx42da.vercel.app",
    ],
    credentials: true,
  })
);
app.use(express.json());

app.get("/", (req, res) => {
  res.send("API Running");
});


app.use("/api/pdf", uploadRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/documents",documentRoutes);
app.use("/api/auth", userRoute);

const port = process.env.PORT;


const startServer = () => {
    try {
        connectDB()
        app.listen(port, () => {
            console.log(`Example app listening on port ${port}`)
        })
    } catch (error) {
        console.log(error)
    }
}

startServer()