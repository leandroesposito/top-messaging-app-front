import PrivateChats from "./PrivateChats";
import GroupChats from "./GroupChats";
import { useState } from "react";
import { ArrowLeftFromLine, ArrowRightFromLine } from "lucide-react";

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
        {hidden ? (
          <ArrowRightFromLine size={18} />
        ) : (
          <ArrowLeftFromLine size={18} />
        )}
      </button>
    </div>
  );
}
