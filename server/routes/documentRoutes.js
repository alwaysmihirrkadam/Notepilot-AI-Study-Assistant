// routes/documentRoutes.js

import express from "express";
import { deleteDocument, getDocuments } from "../controller/documentController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import client from "../services/chroma.js";

const router = express.Router();

router.get("/debug", async (req, res) => {
  try {
    const collection =
      await client.getCollection({
        name: "study-notes",
      });

    const data =
      await collection.get();

    return res.json(data);

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
});
router.get("/collections", async (req, res) => {
  try {
    const collections =
      await client.listCollections();

    return res.json(collections);
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});
router.get("/create-test", async (req, res) => {
  try {
    const collection =
      await client.getOrCreateCollection({
        name: "study-notes",
      });

    return res.json({
      success: true,
      name: collection.name,
    });
  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});
router.get("/test/:id", async (req, res) => {
  try {
    const collection =
      await client.getCollection({
        name: "study-notes",
      });

    const data =
      await collection.get({
        where: {
          documentId: req.params.id,
        },
      });

    return res.json(data);

  } catch (error) {
    return res.json({
      error: error.message,
    });
  }
});

router.get("/", authMiddleware, getDocuments);
router.delete("/:documentId", authMiddleware, deleteDocument);

export default router;