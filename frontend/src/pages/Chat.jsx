import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Chat() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const sendMessage = async (e) => {
    e?.preventDefault?.();

    if (!input.trim()) return;

    setError("");
    const userMsg = { role: "user", text: input };
    setMessages((prev) => [...prev, userMsg]);

    const currentInput = input;
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", { message: currentInput });

      const botMsg = {
        role: "bot",
        text: res.data.reply || "Sorry, I couldn't generate a response.",
      };

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get response. Please try again.";

      setError(errorMsg);

      setMessages((prev) => [
        ...prev,
        {
          role: "bot",
          text: `⚠️ ${errorMsg}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">AI Chat Assistant</h2>
            <p className="page-subtitle">
              Ask questions about your uploaded documents and get instant
              answers with AI.
            </p>
          </div>
          <span className="hero-badge">Real-time help</span>
        </div>

        <div className="chat-panel">
          {messages.length === 0 && !loading && (
            <div className="text-center text-muted mt-5">
              <p>
                No messages yet. Start by asking a question about your
                documents!
              </p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-3 d-flex ${
                msg.role === "user"
                  ? "justify-content-end"
                  : "justify-content-start"
              }`}
            >
              <div
                className={`message-bubble ${msg.role === "user" ? "user" : "bot"}`}
                style={
                  msg.isError
                    ? { backgroundColor: "#f8d7da", color: "#721c24" }
                    : undefined
                }
              >
                {msg.text}
              </div>
            </div>
          ))}

          {loading && (
            <div className="mb-3 d-flex justify-content-start">
              <div className="message-bubble bot">
                <span className="text-muted">⏳ AI is thinking...</span>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {error && <div className="alert alert-danger mb-3">{error}</div>}

        <form onSubmit={sendMessage}>
          <div className="chat-footer">
            <input
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask something about your documents..."
              disabled={loading}
            />
            <button
              className="btn btn-primary"
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              type="submit"
            >
              {loading ? "Sending..." : "Send"}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}

export default Chat;
