import { useEffect, useRef, useState } from "react";
import "./Dialog.css";
import ProfileDialog from "./ProfileDialog";
import { getUserId } from "../../../../session/sessionManager";
import MyProfileDialog from "./MyProfileDialog";
import GroupDialog from "./GroupDialog/GroupDialog";
import { X } from "lucide-react";

export default function Dialog({
  currentChat,
  onCloseDialogClick,
  onChatClick,
}) {
  const [collapsed, setCollapsed] = useState(true);
  const closeButtonRef = useRef();

  useEffect(() => {
    setTimeout(() => {
      setCollapsed(false);
      closeButtonRef.current.focus();
    }, 10);
  }, []);

  return (
    <div
      className={`dialog-box ${collapsed ? "collapsed" : ""}`}
      role="dialog"
      aria-labelledby="dialog-title"
    >
      <button
        onClick={onCloseDialogClick}
        className="close-dialog-button round"
        aria-label="Close dialog"
        ref={closeButtonRef}
      >
        <X />
      </button>
      {currentChat.type === "profile" && currentChat.id === getUserId() && (
        <MyProfileDialog />
      )}
      {currentChat.type === "profile" && currentChat.id !== getUserId() && (
        <ProfileDialog id={currentChat.id} onCloseDialog={onCloseDialogClick} />
      )}
      {currentChat.type === "group" && (
        <GroupDialog
          id={currentChat.id}
          onChatClick={onChatClick}
          onCloseDialog={onCloseDialogClick}
        />
      )}
    </div>
  );
}
