import ChatContainer from "./ChatContainer/ChatContainer";
import NewMessageForm from "./NewMessageForm/NewMessageForm";
import "./MainPanel.css";
import ChatHeader from "./ChatHeader/ChatHeader";
import { useEffect, useState } from "react";

export default function MainPanel({ currentChat, onChatClick }) {
  const [displayDialog, setDisplayDialog] = useState(false);

  function onChatHeaderClick() {
    setDisplayDialog(true);
  }

  return (
    <div className="main-panel">
      {currentChat.type !== null && currentChat.id !== null && (
        <>
          <ChatHeader
            currentChat={currentChat}
            onChatHeaderClick={onChatHeaderClick}
          />
          <ChatContainer currentChat={currentChat} onChatClick={onChatClick} />
          <NewMessageForm currentChat={currentChat} />
        </>
      )}
    </div>
  );
}
