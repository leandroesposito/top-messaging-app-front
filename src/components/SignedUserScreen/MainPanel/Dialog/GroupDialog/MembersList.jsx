import { useEffect } from "react";
import useFetch from "../../../../../hooks/useFetch";
import Loading from "../../../../Loading/Loading";
import FlashMessage from "../../../../FlashMessage/FlashMessage";
import MemberItem from "./MemberItem";
import { getUserId } from "../../../../../session/sessionManager";
import "./MembersList.css";

export default function MembersList({ id, ownerId, onChatClick }) {
  const [loading, data, errors, makeRequest] = useFetch();

  useEffect(() => {
    makeRequest(`/groups/${id}/members`, "GET", true);
  }, [makeRequest, id]);

  const isOwner = ownerId === getUserId();

  return (
    <div className="members-list">
      <h3>Members</h3>
      {loading && data === null && <Loading size={4} />}
      {errors &&
        errors.length > 0 &&
        errors.map((e, index) => {
          return <FlashMessage type={"error"} message={e} key={index} />;
        })}
      {data !== null &&
        Array.isArray(data.members) &&
        data.members.length > 0 &&
        data.members.map((m) => {
          return (
            <MemberItem
              id={m.id}
              publicName={m.publicName}
              key={m.id}
              groupId={id}
              isOwner={isOwner}
              onChatClick={onChatClick}
            />
          );
        })}
    </div>
  );
}
