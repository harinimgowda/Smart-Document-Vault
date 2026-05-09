const Document = require("../models/documentModel");
const fs = require("fs");
const path = require("path");
const pdfParseRaw = require("pdf-parse");
const pdfParse = pdfParseRaw.default || pdfParseRaw;
const mammoth = require("mammoth");
const { summarizeText } = require("../services/aiService");

const fallbackSummary = (text) => {
  if (!text) return "No summary available.";
  const sentences =
    text
      .replace(/\s+/g, " ")
      .match(/[^.!?]+[.!?]+/g)
      ?.map((sentence) => sentence.trim()) || [];

  if (sentences.length >= 2) {
    return sentences.slice(0, 2).join(" ");
  }

  const words = text.split(/\s+/).filter(Boolean);
  if (words.length <= 60) {
    return words.join(" ");
  }

  return `${words.slice(0, 60).join(" ")}...`;
};

// 📤 UPLOAD DOCUMENTS (FINAL FIXED VERSION)
const uploadDocument = async (req, res) => {
  try {
    console.log("FILES RECEIVED:", req.files);

    const { title, category } = req.body;

    if (!req.files || req.files.length === 0) {
      return res.status(400).json({ message: "No files uploaded" });
    }

    const documents = [];

    for (const file of req.files) {
      console.log("Saving file:", file.filename); // 🔥 DEBUG

      let extractedText = "";
      let summary = "";

      // 📄 FILE TEXT EXTRACTION
      try {
        const fileName = file.originalname.toLowerCase();
        const isDocx = fileName.endsWith(".docx");
        const isDoc = fileName.endsWith(".doc");

        if (file.mimetype === "application/pdf") {
          const buffer = fs.readFileSync(file.path);
          const data = await pdfParse(buffer);
          extractedText = data.text;
        } else if (isDocx) {
          const result = await mammoth.extractRawText({
            path: file.path,
          });
          extractedText = result.value || "";
        } else if (isDoc) {
          // .doc is not reliably supported by mammoth; upload file without extracted text.
          extractedText = "";
        }
      } catch (err) {
        console.log("FILE PARSE ERROR:", err.message);
        extractedText = "";
      }

      // 🤖 SAFE AI (WILL NOT BREAK UPLOAD)
      const fallbackMetadataSummary = () => {
        const parts = [];
        if (title) parts.push(`Title: ${title}`);
        if (category) parts.push(`Category: ${category}`);
        if (file.originalname) parts.push(`File: ${file.originalname}`);
        return parts.length > 0
          ? parts.join(" | ")
          : "Document summary is unavailable.";
      };

      try {
        if (extractedText && extractedText.length > 50) {
          summary = await summarizeText(extractedText);

          if (!summary || summary.trim().length < 40) {
            summary = fallbackSummary(extractedText);
          }
        } else {
          summary = fallbackMetadataSummary();
        }
      } catch (err) {
        console.log("AI ERROR:", err.message);
        summary = extractedText
          ? fallbackSummary(extractedText)
          : fallbackMetadataSummary();
      }

      // 🔥 IMPORTANT: ALWAYS USE filename (NOT file.path)
      const safeFilePath = `uploads/${file.filename}`;

      console.log("Saved filePath in DB:", safeFilePath); // 🔥 DEBUG

      const doc = await Document.create({
        title,
        category,
        filePath: safeFilePath,
        fileType: file.mimetype,
        originalName: file.originalname,
        uploadedBy: req.user.id,
        summary,
        fullText: extractedText,
        fileSize: file.size,
      });

      documents.push(doc);
    }

    res.status(201).json({
      message: "Upload successful",
      documents,
    });
  } catch (error) {
    console.log("UPLOAD ERROR:", error);
    res.status(500).json({
      message: "Upload failed",
      error: error.message || "Unknown upload error",
    });
  }
};

// 📥 GET DOCUMENTS
const getDocuments = async (req, res) => {
  try {
    let query = {};

    // If not admin, only show documents uploaded by the user
    if (req.user.role !== "admin") {
      query.uploadedBy = req.user.id;
    }

    const docs = await Document.find(query)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    res.json(docs);
  } catch (error) {
    res.status(500).json({ message: "Error fetching documents" });
  }
};

// 🔍 SEARCH WITH HIGHLIGHT
const searchWithHighlight = async (req, res) => {
  try {
    const { keyword } = req.query;

    if (!keyword || !keyword.trim()) {
      return res.status(400).json({ message: "Keyword required" });
    }

    const searchTerm = keyword.trim();
    const escapedTerm = searchTerm.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(escapedTerm, "i");

    const baseQuery =
      req.user.role !== "admin" ? { uploadedBy: req.user.id } : {};

    const regexQuery = {
      ...baseQuery,
      $or: [
        { title: regex },
        { category: regex },
        { originalName: regex },
        { summary: regex },
        { fullText: regex },
      ],
    };

    let docs = await Document.find(regexQuery)
      .populate("uploadedBy", "name email")
      .sort({ createdAt: -1 });

    if (docs.length === 0) {
      const textQuery = {
        ...baseQuery,
        $text: { $search: searchTerm },
      };

      docs = await Document.find(textQuery)
        .populate("uploadedBy", "name email")
        .sort({ createdAt: -1 });
    }

    res.json(docs);
  } catch (error) {
    console.log("SEARCH ERROR:", error);
    res.status(500).json({ message: "Search failed" });
  }
};

// ❌ DELETE DOCUMENT
const deleteDocument = async (req, res) => {
  try {
    const doc = await Document.findById(req.params.id);

    if (!doc) {
      return res.status(404).json({ message: "Document not found" });
    }

    // Check if user is admin or the uploader
    if (
      req.user.role !== "admin" &&
      doc.uploadedBy.toString() !== req.user.id
    ) {
      return res
        .status(403)
        .json({ message: "Access denied: can only delete your own documents" });
    }

    const absolutePath = path.join(__dirname, "../../", doc.filePath);

    console.log("Deleting file:", absolutePath); // 🔥 DEBUG

    if (fs.existsSync(absolutePath)) {
      fs.unlinkSync(absolutePath);
    }

    await doc.deleteOne();

    res.json({ message: "Deleted successfully" });
  } catch (error) {
    console.log("DELETE ERROR:", error);
    res.status(500).json({ message: "Delete failed" });
  }
};

module.exports = {
  uploadDocument,
  getDocuments,
  searchWithHighlight,
  deleteDocument,
};
