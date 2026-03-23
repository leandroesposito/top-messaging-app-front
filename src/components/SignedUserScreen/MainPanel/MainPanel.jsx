import ChatContainer from "./ChatContainer/ChatContainer";
import NewMessageForm from "./NewMessageForm/NewMessageForm";
import "./MainPanel.css";
import ChatHeader from "./ChatHeader/ChatHeader";
import Dialog from "./Dialog/Dialog";
import { useEffect, useState } from "react";

export default function MainPanel({ currentChat, onChatClick }) {
  const [displayDialog, setDisplayDialog] = useState(false);

  useEffect(closeDialog, [currentChat]);

  function closeDialog() {
    setDisplayDialog(false);
  }

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
          {displayDialog === true && (
            <Dialog
              currentChat={currentChat}
              onCloseDialogClick={closeDialog}
              onChatClick={onChatClick}
            />
          )}
          <ChatContainer currentChat={currentChat} onChatClick={onChatClick} />
          <NewMessageForm currentChat={currentChat} />
        </>
      )}
    </div>
  );
}
