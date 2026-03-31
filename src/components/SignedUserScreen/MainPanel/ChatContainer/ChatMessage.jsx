import { Trash2 } from "lucide-react";
import useFetch from "../../../../hooks/useFetch";
import { getUserId } from "../../../../session/sessionManager";
import "./ChatMessage.css";
import FlashMessage from "../../../FlashMessage/FlashMessage";

export default function ChatMessage({
  id,
  userId,
  name,
  body,
  createdAt,
  onChatClick,
  chatType,
}) {
  const [loading, data, errors, makeRequest] = useFetch();

  function onDelete() {
    if (chatType === "profile") {
      makeRequest(`/messages/${id}`, "DELETE", true);
    } else if (chatType === "group") {
      makeRequest(`/groups/messages/${id}`, "DELETE", true);
    }
  }

  const isMine = userId === getUserId();

  if (data && data.success) {
    return null;
  }

  return (
    <div className={`chat-message ${isMine ? "mine" : ""}`}>
      <button
        className="message-user"
        data-id={userId}
        data-type="profile"
        data-name={name}
        onClick={onChatClick}
      >
        {name}
      </button>
      <pre className="message-content">{body}</pre>
      {errors.map((error, index) => (
        <FlashMessage message={error} type={"error"} key={index} />
      ))}
      <div className="message-date">{new Date(createdAt).toLocaleString()}</div>
      {isMine && (
        <button
          className="delete-message-button danger round"
          aria-label="Delete message"
          onClick={onDelete}
          disabled={loading}
        >
          <Trash2 />
        </button>
      )}
    </div>
  );
}
