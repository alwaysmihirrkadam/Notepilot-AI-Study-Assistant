// routes/documentRoutes.js

import express from "express";
import { deleteDocument, getDocuments } from "../controller/documentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import client from "../services/chroma.js";

const router = express.Router();

router.get("/", authMiddleware, getDocuments);
router.delete("/:documentId", authMiddleware, deleteDocument);

export default router;