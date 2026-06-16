// D:\NotePilot\server\routes\chatRoutes.js
import express from 'express';
import { askDocumentQuestion } from '../controller/chatController.js';
// Import your auth middleware if you protect this route
import authMiddleware from '../middleware/authMiddleware.js'; 

const router = express.Router();

// POST route for asking questions
router.post('/ask', authMiddleware, askDocumentQuestion);

export default router;