import PrivateChats from "./PrivateChats";
import GroupChats from "./GroupChats";
import { useState } from "react";

export default function ChatsPanel({ onChatClick, currentChat }) {
  const [hidden, setHidden] = useState(false);

  function onVisibilityClick() {
    setHidden(!hidden);
  }

  return (
    <div className={`chats-panel ${hidden ? "hidden" : ""}`}>
      <PrivateChats onChatClick={onChatClick} currentChat={currentChat} />
      <GroupChats onChatClick={onChatClick} currentChat={currentChat} />
      <button
        className="chats-visibility-button"
        onClick={onVisibilityClick}
        aria-label={`${hidden ? "Display" : "Hide"} chats list`}
      >
        {hidden ? ">" : "<"}
      </button>
    </div>
  );
}
