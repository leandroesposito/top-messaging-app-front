import ChatContainer from "./ChatContainer/ChatContainer";
import NewMessageForm from "./NewMessageForm/NewMessageForm";
import "./MainPanel.css";

export default function MainPanel({ currentChat, onChatClick }) {
  return (
    <div className="main-panel">
      {currentChat.type !== null && currentChat.id !== null && (
        <>
          <ChatContainer currentChat={currentChat} onChatClick={onChatClick} />
          <NewMessageForm currentChat={currentChat} />
        </>
      )}
    </div>
  );
}
