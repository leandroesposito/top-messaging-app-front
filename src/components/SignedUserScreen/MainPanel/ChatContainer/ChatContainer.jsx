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
    const getMessages = () => {
      if (currentChat.type === "group") {
        makeRequest(`/groups/${currentChat.id}/messages`, "GET", true);
      } else if (currentChat.type === "profile") {
        makeRequest(`/messages/${currentChat.id}`, "GET", true);
      }
    };

    if (errors.length > 0) {
      return;
    }

    getMessages();

    const intervalId = setInterval(getMessages, 1000);

    return () => {
      clearInterval(intervalId);
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
      {errors &&
        errors.length > 0 &&
        errors.map((e, index) => {
          <FlashMessage type={"error"} message={e} key={index} />;
        })}
      {errors.length === 0 &&
        data !== null &&
        data.messages.length > 0 &&
        data.messages.map((m) => {
          return <ChatMessage key={m.id} {...m} onChatClick={onChatClick} />;
        })}
      <div ref={chatEnding}></div>
    </div>
  );
}
