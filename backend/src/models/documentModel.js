const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
    },

    category: {
      type: String,
      default: "General",
    },

    filePath: {
      type: String,
      required: true, // e.g. "uploads/12345.pdf"
    },

    fileType: {
      type: String,
    },

    originalName: {
      type: String,
    },

    fileSize: {
      type: Number,
    },

    uploadedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    // 🔍 For search
    fullText: {
      type: String,
      default: "",
    },

    // 🤖 AI summary
    summary: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true, // adds createdAt & updatedAt
  },
);

// 🔍 Enable fast text search (important)
documentSchema.index({
  title: "text",
  category: "text",
  summary: "text",
  fullText: "text",
  originalName: "text",
});

module.exports = mongoose.model("Document", documentSchema);
