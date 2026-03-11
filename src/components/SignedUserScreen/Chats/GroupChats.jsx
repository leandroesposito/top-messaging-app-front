import { useEffect, useRef } from "react";
import useFetch from "../../../hooks/useFetch";
import ChatItem from "./ChatItem";
import FlashMessage from "../../FlashMessage/FlashMessage";
import Loading from "../../Loading/Loading";

export default function GroupChats() {
  const [loading, data, errors, makeRequest] = useFetch();
  const isFirstRender = useRef(true);

  useEffect(() => {
    const getGroups = () => {
      makeRequest("/groups", "GET", true);
    };

    if (isFirstRender.current) {
      getGroups();
      isFirstRender.current = false;
    }

    const timeoutId = setTimeout(getGroups, 10000);

    return () => {
      clearTimeout(timeoutId);
    };
  }, [makeRequest]);

  return (
    <div className="group-chats-list">
      <h2>Groups</h2>
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
            <ChatItem {...g} key={g.id} disabled={loading && data !== null} />
          );
        })}
    </div>
  );
}
