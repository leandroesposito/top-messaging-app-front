import { useEffect, useState } from "react";
import { getFriendCode } from "../../../../session/sessionManager";
import FlashMessage from "../../../FlashMessage/FlashMessage";
import AddFriendForm from "./AddFriendForm";
import { Clipboard, ClipboardCheck } from "lucide-react";

export default function AddFriend({ display, onCloseAddFriend }) {
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    let timeoutId;
    if (showCopied) {
      timeoutId = setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showCopied]);

  function onCopyClick() {
    navigator.clipboard.writeText(getFriendCode());
    setShowCopied(true);
  }

  if (!display) {
    return null;
  }

  return (
    <div className="add-friend-container">
      <p>
        Your friend code is: {getFriendCode()}
        <button
          className="round"
          onClick={onCopyClick}
          aria-label="Copy friend code"
        >
          {showCopied ? <ClipboardCheck /> : <Clipboard />}
        </button>
      </p>
      {showCopied && <FlashMessage message={"Copied"} type={"success"} />}
      <AddFriendForm onCloseAddFriend={onCloseAddFriend} />
    </div>
  );
}
