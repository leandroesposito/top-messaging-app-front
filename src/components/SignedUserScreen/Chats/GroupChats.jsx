import { useEffect, useState } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import FlashMessage from "../../FlashMessage/FlashMessage";
import Loading from "../../Loading/Loading";
import JoinGroupForm from "./JoinGroup/JoinGroupForm";
import GroupForm from "../MainPanel/Dialog/GroupDialog/GroupForm";

export default function GroupChats({ onChatClick, currentChat }) {
  const [loading, data, errors, makeRequest] = useFetch();
  const [showJoinGroup, setShowJoinGroup] = useState(false);
  const [showCreateGroup, setShowCreateGroup] = useState(false);

  useEffect(() => {
    let intervalId = null;
    const pollInterval = 2500;
    const idleInterval = 5000;
    const hiddenInterval = 30000;

    const getGroups = () => {
      if (errors.length) {
        return;
      }
      makeRequest("/groups", "GET", true);
    };

    const schedule = (ms) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(getGroups, ms);
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

    getGroups();
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

  function onJoinGroupClick() {
    setShowJoinGroup(!showJoinGroup);
  }

  function onCreateGroupClick() {
    setShowCreateGroup(!showCreateGroup);
  }

  function onCloseCreateGroup() {
    setShowCreateGroup(false);
  }

  function onCloseJoinGroup() {
    setShowJoinGroup(false);
  }

  return (
    <div className="group-chats-list">
      <div className="chats-list-header">
        <h2>Groups</h2>
        <div className="buttons">
          <button onClick={onCreateGroupClick} className="flat">
            {showCreateGroup && "Close "} Create group
          </button>
          <button onClick={onJoinGroupClick} className="flat">
            {showJoinGroup && "Close "} Join group
          </button>
        </div>
      </div>
      {showJoinGroup && <JoinGroupForm onCloseJoinGroup={onCloseJoinGroup} />}
      {showCreateGroup && <GroupForm onCloseCreateGroup={onCloseCreateGroup} />}
      {loading && data === null && <Loading size={4} />}
      {errors &&
        errors.length > 0 &&
        errors.map((e, index) => {
          return <FlashMessage type={"error"} message={e} key={index} />;
        })}
      {data !== null &&
        data.groups.length > 0 &&
        data.groups.map((g) => {
          return (
            <ChatItem
              {...g}
              key={g.id}
              isOpen={currentChat.type === "group" && currentChat.id === g.id}
              chatType={"group"}
              onChatClick={onChatClick}
            />
          );
        })}
    </div>
  );
}
