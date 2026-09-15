import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { listenToUserChats } from "../services/chat";
import ChatWindow from "../components/chat/ChatWindow";

export default function Messages() {
  const { currentUser } = useAuth();
  const { chatId } = useParams();
  const [chats, setChats] = useState([]);

  useEffect(() => {
    const unsubscribe = listenToUserChats(currentUser.uid, setChats);
    return unsubscribe;
  }, [currentUser.uid]);

  return (
    <div className="messages-layout">
      <div className="messages-sidebar">
        <h3>Conversaciones</h3>
        <div style={{ border: "1px solid var(--border)", borderRadius: "12px", overflow: "hidden", background: "var(--surface)" }}>
          {chats.length === 0 && (
            <p style={{ padding: "1rem", fontSize: "0.85rem", color: "#6b7370" }}>Todavía no tienes conversaciones.</p>
          )}
          {chats.map((chat) => (
            <a>
              key={chat.id}
              href={"/mensajes/" + chat.id}
              style={{ display: "block", padding: "0.75rem 1rem", borderBottom: "1px solid var(--border)", textDecoration: "none" }}
              <strong style={{ fontSize: "0.9rem" }}>{chat.productTitle}</strong>
              <p style={{ fontSize: "0.8rem", color: "#6b7370", margin: "0.2rem 0 0" }}>{chat.lastMessage}</p>
            </a>
          ))}
        </div>
      </div>

      <div className="messages-chat">
        {chatId ? <ChatWindow chatId={chatId} /> : <p style={{ color: "#6b7370" }}>Selecciona una conversación.</p>}
      </div>
    </div>
  );
}