const { chatWithAI } = require("../services/aiService");

// ✅ CHAT CONTROLLER
const chatAI = async (req, res) => {
  try {
    const { message } = req.body;

    if (!message) {
      return res.status(400).json({ message: "Message required" });
    }

    const reply = await chatWithAI(message);

    res.json({ reply });
  } catch (error) {
    console.log("AI CONTROLLER ERROR:", error);
    res.status(500).json({ message: "AI failed" });
  }
};

module.exports = {
  chatAI,
};
