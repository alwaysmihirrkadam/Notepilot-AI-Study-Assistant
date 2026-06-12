import Document from "../models/Document.js";
import client from "../services/chroma.js";
import cloudinary from "../services/cloudinary.js";

export const getDocuments = async (req, res) => {
  try {
    const documents = await Document.find({
      userId: req.user.id,
    });

    return res.json({
      success: true,
      documents,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};


export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    const document = await Document.findOne({ documentId, userId: req.user.id, });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    const collection = await client.getCollection({ name: "study-notes", });

    await collection.delete({ where: { documentId, }, });

    await cloudinary.uploader.destroy(document.publicId, {
      resource_type: "raw",
    }
    );

    await Document.deleteOne({ documentId });

    return res.json({
      success: true,
      message: "Document deleted",
    });

  } catch (error) {
    console.error(error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};