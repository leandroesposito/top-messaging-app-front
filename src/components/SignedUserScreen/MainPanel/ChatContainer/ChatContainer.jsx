import { useEffect, useRef } from "react";
import useFetch from "../../../../hooks/useFetch";
import Loading from "../../../Loading/Loading";
import ChatMessage from "./ChatMessage";
import "./ChatContainer.css";
import FlashMessage from "../../../FlashMessage/FlashMessage";

export default function ChatContainer({ currentChat, onChatClick }) {
  const [loading, data, errors, makeRequest, reset] = useFetch();
  const chatEnding = useRef(null); // used to scroll on opening and new messages

  useEffect(() => {
    let intervalId = null;
    const pollInterval = 2500;
    const idleInterval = 5000;
    const hiddenInterval = 30000;

    const getMessages = () => {
      if (errors.length) {
        return;
      }
      if (currentChat.type === "group") {
        makeRequest(`/groups/${currentChat.id}/messages`, "GET", true);
      } else if (currentChat.type === "profile") {
        makeRequest(`/messages/${currentChat.id}`, "GET", true);
      }
    };

    const schedule = (ms) => {
      if (intervalId) {
        clearInterval(intervalId);
      }
      intervalId = setInterval(getMessages, ms);
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

    getMessages();
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
  }, [currentChat, makeRequest, errors]);

  useEffect(() => {
    setTimeout(() => {
      if (chatEnding.current) {
        chatEnding.current.scrollIntoView();
      }
    }, 50);
    reset();
  }, [currentChat, reset]);

  useEffect(() => {
    const { scrollTop, scrollHeight, clientHeight } =
      chatEnding.current.parentElement;
    const distanceFromBottom = scrollHeight - scrollTop - clientHeight;

    if (distanceFromBottom < 500) {
      chatEnding.current.scrollIntoView();
    }
  }, [data]);

  return (
    <div className="messages-container">
      {loading && data === null && <Loading size={4} />}
      {data !== null &&
        data.messages.length > 0 &&
        data.messages.map((m) => {
          return <ChatMessage key={m.id} {...m} onChatClick={onChatClick} />;
        })}
      {data !== null && typeof data.message !== "undefined" && (
        <FlashMessage type={"success"} message={data.message} />
      )}
      {errors &&
        errors.length > 0 &&
        errors.map((e, index) => {
          return <FlashMessage type={"error"} message={e} key={index} />;
        })}
      <div ref={chatEnding}></div>
    </div>
  );
}
