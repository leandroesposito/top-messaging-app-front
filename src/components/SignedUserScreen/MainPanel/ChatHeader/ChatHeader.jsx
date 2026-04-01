import "./ChatHeader.css";

export default function ChatHeader({ currentChat, onChatHeaderClick }) {
  return (
    <button
      className="chat-header"
      onClick={onChatHeaderClick}
      data-type={currentChat.type}
      data-id={currentChat.id}
      data-name={currentChat.name}
      aria-live="polite"
      aria-relevant="text"
      aria-label="Current chat name"
    >
      <div className="name">{currentChat.name}</div>
    </button>
  );
}
