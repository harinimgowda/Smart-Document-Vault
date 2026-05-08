import { useState, useRef, useEffect } from "react";
import API from "../services/api";
import Navbar from "../components/Navbar";

function Chat() {
  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content:
        "Hello! I'm your AI assistant. Ask me anything about your documents or workflows.",
    },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileError, setFileError] = useState("");
  const [shareUrl, setShareUrl] = useState("");
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

    const userMessage = {
      role: "user",
      content: input.trim(),
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await API.post("/ai/chat", {
        messages: updatedMessages,
      });

      const assistantText =
        res.data.reply || "Sorry, I couldn't generate a response.";

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: assistantText,
        },
      ]);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message ||
        err?.message ||
        "Failed to get response. Please try again.";

      setError(errorMsg);

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: `⚠️ ${errorMsg}`,
          isError: true,
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (event) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      sendMessage(event);
    }
  };

  const handleFileChange = (e) => {
    setFileError("");
    setSelectedFile(e.target.files[0] || null);
  };

  const handleUploadDocument = async () => {
    if (!selectedFile) {
      setFileError("Please select a document first.");
      return;
    }

    setError("");
    setFileError("");
    setLoading(true);

    try {
      const formData = new FormData();
      formData.append("files", selectedFile);
      formData.append("title", selectedFile.name);
      formData.append("category", "chat-upload");

      const res = await API.post("/documents/upload", formData);
      const doc = res.data.documents?.[0];
      const summary =
        doc?.summary || "Document was uploaded, but no summary was returned.";

      setMessages((prev) => [
        ...prev,
        {
          role: "user",
          content: `Uploaded document: ${selectedFile.name}`,
        },
        {
          role: "assistant",
          content: `Document Summary:\n${summary}`,
        },
      ]);
      setSelectedFile(null);
    } catch (err) {
      const errorMsg =
        err?.response?.data?.message || err?.message || "Upload failed.";
      setFileError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    const payload = {
      title: "Shared AI Chat",
      messages,
    };

    const json = JSON.stringify(payload);
    const base64 = btoa(unescape(encodeURIComponent(json)));
    const encoded = encodeURIComponent(base64);
    const url = `${window.location.origin}/share?data=${encoded}`;

    setShareUrl(url);
    window.open(url, "_blank");

    if (navigator.clipboard) {
      navigator.clipboard.writeText(url).catch(() => {});
    }
  };

  return (
    <>
      <Navbar />

      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">ChatGPT-style Assistant</h2>
            <p className="page-subtitle">
              Have a natural conversation with the AI and get smart answers for
              your documents.
            </p>
          </div>
          <span className="hero-badge">ChatGPT interface</span>
        </div>

        <div className="chat-panel">
          {messages.length === 0 && !loading && (
            <div className="text-center text-muted mt-5">
              <p>Type a message to begin chatting with the assistant.</p>
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
                className={`message-bubble ${
                  msg.role === "user" ? "user" : "bot"
                }`}
                style={
                  msg.isError
                    ? { backgroundColor: "#f8d7da", color: "#721c24" }
                    : undefined
                }
              >
                <div className="message-meta mb-2 text-uppercase text-xs opacity-80">
                  {msg.role === "user" ? "You" : "Assistant"}
                </div>
                <div>{msg.content}</div>
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

        <div className="upload-card mb-4">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <div>
              <h5 className="mb-1">Upload a document for summary</h5>
              <p className="text-muted mb-0">
                Upload one document to extract its summary and add it to the
                chat context.
              </p>
            </div>
            <button
              className="btn btn-secondary"
              type="button"
              onClick={handleShare}
            >
              Share
            </button>
          </div>

          <div className="mb-3">
            <input
              type="file"
              accept=".pdf,.doc,.docx"
              onChange={handleFileChange}
              disabled={loading}
            />
          </div>

          {selectedFile && (
            <div className="mb-3 d-flex align-items-center justify-content-between">
              <div>
                <strong>{selectedFile.name}</strong>
                <p className="text-muted mb-0">
                  {(selectedFile.size / 1024).toFixed(1)} KB
                </p>
              </div>
              <button
                className="btn btn-outline-danger btn-sm"
                type="button"
                onClick={() => setSelectedFile(null)}
                disabled={loading}
              >
                Remove
              </button>
            </div>
          )}

          {fileError && <div className="alert alert-warning">{fileError}</div>}

          <button
            className="btn btn-success"
            type="button"
            onClick={handleUploadDocument}
            disabled={loading}
          >
            {loading ? "Uploading..." : "Upload & Summarize"}
          </button>

          {shareUrl && (
            <div className="mt-3 small">
              Shared link created. Opened in a new tab and copied to clipboard.
            </div>
          )}
        </div>

        <form onSubmit={sendMessage}>
          <div className="chat-footer">
            <textarea
              className="form-control"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask something about your documents..."
              disabled={loading}
              rows={2}
            />
            <button
              className="btn btn-primary"
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
