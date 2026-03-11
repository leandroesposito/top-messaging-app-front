import { useEffect, useRef } from "react";
import useFetch from "../../hooks/useFetch";
import Header from "../Header/Header";
import ChatsPanel from "./Chats/ChatsPanel";

export default function SigneduserScreen() {
  const loaded = useRef(false);
  const [, , , makeRequest] = useFetch();

  useEffect(() => {
    if (!loaded.current) {
      makeRequest("/users/status", "PUT", true, { "is-online": true });
      loaded.current = true;
      window.addEventListener("beforeunload", () => {
        makeRequest("/users/status", "PUT", true, { "is-online": false });
      });
    }
  }, [makeRequest]);

  return (
    <>
      <Header />
      <main>
        <ChatsPanel />
        <div></div>
      </main>
    </>
  );
}
