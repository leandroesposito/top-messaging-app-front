import PrivateChats from "./PrivateChats";
import GroupChats from "./GroupChats";

export default function ChatsPanel({ onChatClick, currentChat }) {
  return (
    <div className="chats-panel">
      <PrivateChats onChatClick={onChatClick} currentChat={currentChat} />
      <GroupChats onChatClick={onChatClick} currentChat={currentChat} />
    </div>
  );
}
