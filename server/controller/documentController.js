import Document from "../models/Document.js";
import cloudinary from "../services/cloudinary.js"; // Kept for asset hosting cleanup

// 1. Fetch all documents uploaded by a specific user
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

// 2. Completely delete document assets from Cloudinary and MongoDB
export const deleteDocument = async (req, res) => {
  try {
    const { documentId } = req.params;

    // Verify the document belongs to the active requesting user
    const document = await Document.findOne({ documentId, userId: req.user.id });

    if (!document) {
      return res.status(404).json({
        success: false,
        message: "Document not found",
      });
    }

    // 🔥 FIX: Pinecone vector reference removed completely to prevent runtime crashes!

    // Clean up physical file storage on Cloudinary securely
    if (document.publicId) {
      await cloudinary.uploader.destroy(document.publicId, {
        resource_type: "raw",
      });
    }

    // Drop the document profile and full extracted text directly out of MongoDB
    await Document.deleteOne({ documentId });

    return res.json({
      success: true,
      message: "Document deleted successfully",
    });

  } catch (error) {
    console.error("❌ Delete Document Error:", error);

    return res.status(500).json({
      success: false,
      error: error.message,
    });
  }
};