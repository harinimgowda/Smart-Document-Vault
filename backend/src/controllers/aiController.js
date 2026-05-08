const { chatWithAI } = require("../services/aiService");

// ✅ CHAT CONTROLLER
const chatAI = async (req, res) => {
  try {
    const { messages } = req.body;

    if (!Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ message: "Messages array required" });
    }

    const reply = await chatWithAI(messages);

    if (!reply) {
      return res.status(500).json({ message: "AI failed to respond" });
    }

    res.json({ reply });
  } catch (error) {
    console.log("AI CONTROLLER ERROR:", error);
    res.status(500).json({ message: "AI failed" });
  }
};

module.exports = {
  chatAI,
};
