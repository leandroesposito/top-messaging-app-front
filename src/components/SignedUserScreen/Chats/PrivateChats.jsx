import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import FlashMessage from "../../FlashMessage/FlashMessage";
import Loading from "../../Loading/Loading";
import AddFriend from "./AddFriend/AddFriend";
import { UserPlus, X } from "lucide-react";

export default function PrivateChats({ onChatClick, currentChat }) {
  const [loading, data, errors, makeRequest] = useFetch();
  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    let intervalId = null;
    const pollInterval = 2500;
    const idleInterval = 5000;
    const hiddenInterval = 30000;

    const getPrivateChats = () => {
      if (errors.length) {
        return;
      }
      makeRequest("/messages", "GET", true);
    };

    const schedule = (ms) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(getPrivateChats, ms);
    };

    const updateInterval = () => {
      if (document.hidden) {
        schedule(hiddenInterval);
      } else if (document.hasFocus && !document.hasFocus()) {
        schedule(idleInterval);
      } else {
        schedule(pollInterval);
      }
    };

    getPrivateChats();
    updateInterval();

    const onVisibility = () => updateInterval();
    const onFocus = () => updateInterval();
    const onBlur = () => updateInterval();

    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("focus", onFocus);
    window.addEventListener("blur", onBlur);

    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("focus", onFocus);
      window.removeEventListener("blur", onBlur);
    };
  }, [makeRequest, errors]);

  function onAddFriendClick() {
    setShowAddFriend(!showAddFriend);
  }

  function onCloseAddFriend() {
    setShowAddFriend(false);
  }

  return (
    <div className="private-chats-list">
      <div className="chats-list-header">
        <h2>Friends</h2>
        <div className="buttons">
          <button
            onClick={onAddFriendClick}
            className="round"
            aria-label={showAddFriend ? "Close add friend form" : "Add friend"}
          >
            {showAddFriend ? <X /> : <UserPlus />}
          </button>
        </div>
      </div>
      <AddFriend display={showAddFriend} onCloseAddFriend={onCloseAddFriend} />
      {loading && data === null && <Loading size={4} />}
      {errors &&
        errors.length > 0 &&
        errors.map((e, index) => {
          return <FlashMessage type={"error"} message={e} key={index} />;
        })}
      {data !== null &&
        data.privateChats.length > 0 &&
        data.privateChats.map((pc) => {
          return (
            <ChatItem
              {...pc}
              isOpen={
                currentChat.type === "profile" && currentChat.id === pc.id
              }
              key={pc.id}
              chatType={"profile"}
              onChatClick={onChatClick}
            />
          );
        })}
    </div>
  );
}
