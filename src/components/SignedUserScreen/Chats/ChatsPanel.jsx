import PrivateChats from "./PrivateChats";
import GroupChats from "./GroupChats";
import Loading from "../../Loading/Loading";

export default function ChatsPanel() {
  return (
    <div className="chats-panel">
      <PrivateChats />
      <GroupChats />
    </div>
  );
}
