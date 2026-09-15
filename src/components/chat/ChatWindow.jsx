import { useEffect, useRef, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { listenToMessages, sendMessage } from "../../services/chat";

export default function ChatWindow({ chatId }) {
  const { currentUser } = useAuth();
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const bottomRef = useRef(null);

  useEffect(() => {
    if (!chatId) return;
    const unsubscribe = listenToMessages(chatId, setMessages);
    return unsubscribe;
  }, [chatId]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function handleSend(e) {
    e.preventDefault();
    if (!text.trim()) return;
    await sendMessage(chatId, currentUser.uid, text.trim());
    setText("");
  }

  return (
    <div style={{
      display: "flex",
      flexDirection: "column",
      height: "min(440px, 60vh)",
      border: "1px solid var(--border)",
      borderRadius: "14px",
      background: "var(--surface)",
      boxShadow: "var(--shadow-sm)",
      overflow: "hidden",
    }}>
      <div style={{ flex: 1, overflowY: "auto", padding: "1rem" }}>
        {messages.map((msg) => {
          const isMine = msg.senderId === currentUser.uid;
          return (
            <div key={msg.id} style={{ display: "flex", justifyContent: isMine ? "flex-end" : "flex-start", marginBottom: "0.5rem" }}>
              <span style={{
                background: isMine ? "var(--teal)" : "var(--paper)",
                color: isMine ? "#fff" : "var(--ink)",
                padding: "0.5rem 0.85rem",
                borderRadius: "16px",
                maxWidth: "70%",
                fontSize: "0.9rem",
              }}>
                {msg.text}
              </span>
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      <form onSubmit={handleSend} style={{ display: "flex", borderTop: "1px solid var(--border)" }}>
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escribe un mensaje..."
          style={{ flex: 1, border: "none", padding: "0.8rem", fontFamily: "var(--font-body)", fontSize: "0.9rem", outline: "none" }}
        />
        <button type="submit" className="btn btn-primary" style={{ borderRadius: 0 }}>Enviar</button>
      </form>
    </div>
  );
}