import { useEffect, useState } from "react";
import "./Dialog.css";
import ProfileDialog from "./ProfileDialog";
import { getUserId } from "../../../../session/sessionManager";
import MyProfileDialog from "./MyProfileDialog";
import GroupDialog from "./GroupDialog/GroupDialog";

export default function Dialog({
  currentChat,
  onCloseDialogClick,
  onChatClick,
}) {
  const [collapsed, setCollapsed] = useState(true);

  useEffect(() => {
    setTimeout(() => setCollapsed(false), 10);
  }, []);

  return (
    <div className={`dialog-box ${collapsed ? "collapsed" : ""}`}>
      <button onClick={onCloseDialogClick} className="close-dialog-button">
        X
      </button>
      {currentChat.type === "profile" && currentChat.id === getUserId() && (
        <MyProfileDialog />
      )}
      {currentChat.type === "profile" && currentChat.id !== getUserId() && (
        <ProfileDialog id={currentChat.id} />
      )}
      {currentChat.type === "group" && (
        <GroupDialog id={currentChat.id} onChatClick={onChatClick} />
      )}
    </div>
  );
}
