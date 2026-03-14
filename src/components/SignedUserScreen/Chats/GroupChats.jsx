import { useEffect, useRef, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import FlashMessage from "../../FlashMessage/FlashMessage";
import Loading from "../../Loading/Loading";
import JoinGroup from "./JoinGroup/JoinGroup";

export default function GroupChats({ onChatClick, currentChat }) {
  const [loading, data, errors, makeRequest] = useFetch();
  const isFirstRender = useRef(true);
  const [showJoinGroup, setShowJoinGroup] = useState(false);

  useEffect(() => {
    const getGroups = () => {
      makeRequest("/groups", "GET", true);
    };

    if (isFirstRender.current) {
      getGroups();
      isFirstRender.current = false;
    }

    const intervalId = setInterval(getGroups, 10000);

    return () => {
      clearInterval(intervalId);
    };
  }, [makeRequest]);

  function onJoinGroupClick() {
    setShowJoinGroup(!showJoinGroup);
  }

  return (
    <div className="group-chats-list">
      <div className="chats-list-header">
        <h2>Groups</h2>
        <div className="buttons">
          <button onClick={onJoinGroupClick} className="flat">
            {showJoinGroup && "Close "} Join group
          </button>
        </div>
      </div>
      <JoinGroup display={showJoinGroup} />
      {loading && data === null && <Loading size={4} />}
      {errors &&
        errors.length > 0 &&
        errors.map((e) => {
          <FlashMessage type={"error"} message={e} />;
        })}
      {data !== null &&
        data.groups.length > 0 &&
        data.groups.map((g) => {
          return (
            <ChatItem
              {...g}
              key={g.id}
              isOpen={currentChat.type === "group" && currentChat.id === g.id}
              disabled={loading && data !== null}
              chatType={"group"}
              onChatClick={onChatClick}
            />
          );
        })}
    </div>
  );
}
