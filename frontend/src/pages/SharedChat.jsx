import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import Navbar from "../components/Navbar";

const decodeSharedData = (data) => {
  if (!data) return null;
  try {
    const decoded = atob(decodeURIComponent(data));
    const uriDecoded = decodeURIComponent(
      decoded
        .split("")
        .map((c) => `%${("00" + c.charCodeAt(0).toString(16)).slice(-2)}`)
        .join(""),
    );
    return JSON.parse(uriDecoded);
  } catch (error) {
    return null;
  }
};

function SharedChat() {
  const [searchParams] = useSearchParams();
  const sharedData = useMemo(
    () => decodeSharedData(searchParams.get("data")),
    [searchParams],
  );

  return (
    <>
      <Navbar />
      <div className="container mt-4">
        <div className="page-header">
          <div>
            <h2 className="page-title">Shared AI Chat</h2>
            <p className="page-subtitle">
              This is a shared view of a chat conversation. You can copy the
              link and share it with anyone.
            </p>
          </div>
          <span className="hero-badge">Shared Link</span>
        </div>

        {!sharedData?.messages?.length ? (
          <div className="alert alert-warning">
            No shared conversation data was found or the link is invalid.
          </div>
        ) : (
          <div className="chat-panel">
            {sharedData.messages.map((msg, index) => (
              <div
                key={index}
                className={`mb-3 d-flex ${
                  msg.role === "user"
                    ? "justify-content-end"
                    : "justify-content-start"
                }`}
              >
                <div
                  className={`message-bubble ${msg.role === "user" ? "user" : "bot"}`}
                >
                  <div className="message-meta mb-2 text-uppercase text-xs opacity-80">
                    {msg.role === "user" ? "You" : "Assistant"}
                  </div>
                  <div>{msg.content}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

export default SharedChat;
