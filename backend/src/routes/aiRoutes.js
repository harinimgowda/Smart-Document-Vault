const express = require("express");
const router = express.Router();

const { chatAI } = require("../controllers/aiController");
const protect = require("../middleware/authMiddleware");

// 🔹 CHAT ROUTE
router.post("/chat", protect, chatAI);

module.exports = router;
