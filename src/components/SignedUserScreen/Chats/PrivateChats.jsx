import { useEffect, useRef } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import FlashMessage from "../../FlashMessage/FlashMessage";
import Loading from "../../Loading/Loading";

export default function PrivateChats() {
  const [loading, data, errors, makeRequest] = useFetch();
  const isFirstRender = useRef(true);

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

  return (
    <div className="private-chats-list">
      <h2>Friends</h2>
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
