import { useEffect, useState } from "react";
import { getFriendCode } from "../../../../session/sessionManager";
import FlashMessage from "../../../FlashMessage/FlashMessage";
import AddFriendForm from "./AddFriendForm";

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
        <button className="flat" onClick={onCopyClick}>
          Copy
        </button>
      </p>
      {showCopied && <FlashMessage message={"Copied"} type={"success"} />}
      <AddFriendForm onCloseAddFriend={onCloseAddFriend} />
    </div>
  );
}
