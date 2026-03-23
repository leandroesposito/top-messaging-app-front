import { useEffect, useRef, useState } from "react";
import useFetch from "../../hooks/useFetch";
import Header from "../Header/Header";
import ChatsPanel from "./Chats/ChatsPanel";
import MainPanel from "./MainPanel/MainPanel";

export default function SigneduserScreen() {
  const loaded = useRef(false);
  const [, , , makeRequest] = useFetch();
  const [currentChat, setCurrentChat] = useState({ type: null, id: null });

  useEffect(() => {
    if (!loaded.current) {
      makeRequest("/users/status", "PUT", true, { "is-online": true });
      loaded.current = true;
      window.addEventListener("beforeunload", () => {
        makeRequest("/users/status", "PUT", true, { "is-online": false });
      });
    }
  }, [makeRequest]);

  function onChatClick(event) {
    const buttonData = event.target.closest("button.chat-item, button").dataset;

    setCurrentChat({
      type: buttonData.type,
      id: parseInt(buttonData.id),
      name: buttonData.name,
    });
  }

  return (
    <>
      <Header onChatClick={onChatClick} />
      <main>
        <ChatsPanel onChatClick={onChatClick} currentChat={currentChat} />
        <MainPanel currentChat={currentChat} onChatClick={onChatClick} />
      </main>
    </>
  );
}
