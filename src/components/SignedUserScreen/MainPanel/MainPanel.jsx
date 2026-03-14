import ChatContainer from "./ChatContainer/ChatContainer";
import NewMessageForm from "./NewMessageForm/NewMessageForm";
import "./MainPanel.css";

export default function MainPanel({ currentChat }) {
  return (
    <div className="main-panel">
      {currentChat.type !== null && currentChat.id !== null && (
        <>
          <ChatContainer currentChat={currentChat} />
          <NewMessageForm currentChat={currentChat} />
        </>
      )}
    </div>
  );
}
