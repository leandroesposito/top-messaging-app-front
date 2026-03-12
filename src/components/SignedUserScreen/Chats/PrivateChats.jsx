import { useEffect, useRef, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import FlashMessage from "../../FlashMessage/FlashMessage";
import Loading from "../../Loading/Loading";
import AddFriend from "./AddFriend/AddFriend";

export default function PrivateChats() {
  const [loading, data, errors, makeRequest] = useFetch();
  const isFirstRender = useRef(true);
  const [showAddFriend, setShowAddFriend] = useState(false);

  useEffect(() => {
    const getPrivateChats = () => {
      makeRequest("/messages", "GET", true);
    };

    if (isFirstRender.current) {
      getPrivateChats();
      isFirstRender.current = false;
    }

    const timeoutId = setTimeout(getPrivateChats, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [makeRequest]);

  function onAddFriendClick() {
    setShowAddFriend(!showAddFriend);
  }

  return (
    <div className="private-chats-list">
      <div className="chats-list-header">
        <h2>Friends</h2>
        <div className="buttons">
          <button onClick={onAddFriendClick} className="flat">
            {showAddFriend && "Close "} Add friend
          </button>
        </div>
      </div>
      <AddFriend display={showAddFriend} />
      {loading && data === null && <Loading size={4} />}
      {errors &&
        errors.length > 0 &&
        errors.map((e) => {
          <FlashMessage type={"error"} message={e} />;
        })}
      {data !== null &&
        data.privateChats.length > 0 &&
        data.privateChats.map((pc) => {
          return (
            <ChatItem {...pc} key={pc.id} disabled={loading && data !== null} />
          );
        })}
    </div>
  );
}
