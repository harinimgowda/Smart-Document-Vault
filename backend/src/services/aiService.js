const axios = require("axios");

const chatWithAI = async (message) => {
  try {
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: [
          {
            role: "user",
            content: message,
          },
        ],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data.choices[0].message.content;
  } catch (error) {
    console.log("🔥 ERROR:", error.response?.data || error.message);
    return null;
  }
};

const fallbackSummary = (text) => {
  if (!text) return "No summary available";

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

const summarizeText = async (text) => {
  const prompt = `Please summarize the following document content in 2-3 concise sentences:\n\n${text}`;
  const aiSummary = await chatWithAI(prompt);
  return aiSummary?.trim() || fallbackSummary(text);
};

module.exports = { chatWithAI, summarizeText };
