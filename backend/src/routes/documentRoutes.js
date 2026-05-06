const express = require("express");
const router = express.Router();

const {
  uploadDocument,
  getDocuments,
  deleteDocument,
  searchWithHighlight, // ✅ ADD THIS
} = require("../controllers/documentController");

const protect = require("../middleware/authMiddleware");
const authorizeRoles = require("../middleware/roleMiddleware");
const upload = require("../middleware/uploadMiddleware");

const uploadFiles = (req, res, next) => {
  upload.any()(req, res, (err) => {
    if (err) {
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

// UPLOAD
router.post("/upload", protect, uploadFiles, uploadDocument);

// GET ALL
router.get("/", protect, getDocuments);

// 🔥 ADD SEARCH ROUTE
router.get("/search", protect, searchWithHighlight);

// DELETE
router.delete("/:id", protect, deleteDocument);

module.exports = router;
