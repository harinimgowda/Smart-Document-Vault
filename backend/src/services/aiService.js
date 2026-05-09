const axios = require("axios");

const chatWithAI = async (messages) => {
  try {
    const normalizedMessages = Array.isArray(messages)
      ? messages.map((message) => ({
          role: message.role,
          content: message.content,
        }))
      : [
          {
            role: "user",
            content: String(messages),
          },
        ];

    const promptMessages = [
      {
        role: "system",
        content:
          "You are a helpful AI assistant. Answer user questions clearly, concisely, and politely. Use the conversation context and provide useful replies.",
      },
      ...normalizedMessages,
    ];

    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "openai/gpt-3.5-turbo",
        messages: promptMessages,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
      },
    );

    return response.data?.choices?.[0]?.message?.content?.trim() || null;
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

const makeChunks = (text, maxChars = 4200, overlap = 300) => {
  const chunks = [];
  let start = 0;

  while (start < text.length) {
    const end = Math.min(text.length, start + maxChars);
    chunks.push(text.slice(start, end));
    if (end === text.length) break;
    start += maxChars - overlap;
  }

  return chunks;
};

const summarizeText = async (text) => {
  if (!text) return fallbackSummary(text);

  const normalized = text.trim();
  const chunks = makeChunks(normalized);

  if (chunks.length === 1) {
    const prompt = `Please summarize the following document content in 2-3 concise sentences:\n\n${chunks[0]}`;
    const aiSummary = await chatWithAI(prompt);
    return aiSummary?.trim() || fallbackSummary(normalized);
  }

  const chunkSummaries = [];
  for (let i = 0; i < chunks.length; i += 1) {
    const prompt = `Summarize this document section into 2-3 concise sentences:\n\n${chunks[i]}`;
    const aiSummary = await chatWithAI(prompt);
    chunkSummaries.push(aiSummary?.trim() || fallbackSummary(chunks[i]));
  }

  const combined = chunkSummaries.join("\n\n");
  const finalPrompt = `You are given several section summaries from a document. Combine them into one concise 3-sentence summary that captures the key points of the entire document:\n\n${combined}`;
  const finalSummary = await chatWithAI(finalPrompt);
  return finalSummary?.trim() || fallbackSummary(normalized);
};

module.exports = { chatWithAI, summarizeText };
