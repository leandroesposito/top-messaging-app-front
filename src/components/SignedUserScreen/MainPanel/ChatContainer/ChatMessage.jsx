import { getUserId } from "../../../../session/sessionManager";
import "./ChatMessage.css";

export default function ChatMessage({ userId, name, body, createdAt }) {
  const isMine = userId === getUserId();
  return (
    <div className={`chat-message ${isMine ? "mine" : ""}`}>
      <button className="message-user" data-id={userId}>
        {name}
      </button>
      <pre className="message-content">{body}</pre>
      <div className="message-date">{new Date(createdAt).toLocaleString()}</div>
    </div>
  );
}
