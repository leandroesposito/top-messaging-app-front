import useFetch from "../../../../../hooks/useFetch";
import { getUserId } from "../../../../../session/sessionManager";
import FlashMessage from "../../../../FlashMessage/FlashMessage";
import "./MemberItem.css";

export default function MemberItem({
  groupId,
  publicName,
  id,
  isOwner,
  onChatClick,
}) {
  const [, data, errors, makeRequest] = useFetch();

  function onBanClick() {
    if (confirm(`Are you sure you want to ban ${publicName}?`)) {
      makeRequest(`/groups/${groupId}/members/${id}`, "DELETE", true);
    }
  }

  return (
    <div className="member-item">
      {data === null ? (
        <>
          <div className="member-name">
            <button
              onClick={onChatClick}
              data-type="profile"
              data-id={id}
              data-name={publicName}
            >
              {publicName}
            </button>
          </div>
          {isOwner && id !== getUserId() && (
            <div className="actions">
              <button className="danger" onClick={onBanClick}>
                Ban
              </button>
            </div>
          )}
        </>
      ) : (
        <>
          {typeof data.message === "string" && (
            <FlashMessage message={data.message} type={"success"} />
          )}
          {errors.map((error, index) => {
            return <FlashMessage message={error} type={"error"} key={index} />;
          })}
        </>
      )}
    </div>
  );
}
