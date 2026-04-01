import { useEffect, useState } from "react";
import useFetch from "../../../../../hooks/useFetch";
import FlashMessage from "../../../../FlashMessage/FlashMessage";
import Loading from "../../../../Loading/Loading";
import MembersList from "./MembersList";
import "./GroupDialog.css";
import { getUserId } from "../../../../../session/sessionManager";
import GroupForm from "./GroupForm";
import { Clipboard, ClipboardCheck } from "lucide-react";

export default function GroupDialog({ id, onChatClick, onCloseDialog }) {
  const [loading, data, errors, makeRequest] = useFetch();
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    makeRequest(`/groups/${id}`, "GET", true);
  }, [makeRequest, id]);

  useEffect(() => {
    let timeoutId;
    if (showCopied) {
      timeoutId = setTimeout(() => {
        setShowCopied(false);
      }, 2000);
    }

    return () => {
      clearTimeout(timeoutId);
    };
  }, [showCopied]);

  useEffect(() => {
    if (
      (data === null && errors.length > 0) ||
      (data !== null &&
        typeof data.group === "undefined" &&
        typeof data.message !== "undefined")
    ) {
      setTimeout(onCloseDialog, 2000);
    }
  }, [data, errors, onCloseDialog]);

  function onCopyClick() {
    navigator.clipboard.writeText(data.group.inviteCode);
    setShowCopied(true);
  }

  function onLeaveClick() {
    if (
      confirm(`Are you sure you want to leave the group ${data.group.name}?`)
    ) {
      makeRequest(`/groups/${id}/leave`, "DELETE", true);
    }
  }

  function onDeleteGroupClick() {
    const confirmWord = "DELETE";
    if (
      prompt(
        `Are you sure you want to DELETE the group ${data.group.name}? write "${confirmWord}" to accept.`,
      ) === confirmWord
    ) {
      makeRequest(`/groups/${id}/`, "DELETE", true);
    }
  }

  const isOwner =
    data !== null &&
    typeof data.group !== "undefined" &&
    data.group.ownerId === getUserId();

  return (
    <div className="dialog-content">
      {loading && <Loading />}
      {data !== null && typeof data.group !== "undefined" && (
        <>
          <div className="group-data">
            {isOwner ? (
              <GroupForm
                currentName={data.group.name}
                currentDescription={data.group.description}
                id={data.group.id}
              />
            ) : (
              <>
                <h2 id="dialog-title">{data.group.name}</h2>
                <p>{data.group.description}</p>
              </>
            )}

            <div className="invite-container">
              <span>Invite code:</span> {data.group.inviteCode}{" "}
              <button
                className="round"
                onClick={onCopyClick}
                aria-label="Copy invite code"
              >
                {showCopied ? <ClipboardCheck /> : <Clipboard />}
              </button>
            </div>
            {showCopied && <FlashMessage message={"Copied"} type={"success"} />}
            <div className="buttons">
              {isOwner ? (
                <button className="danger" onClick={onDeleteGroupClick}>
                  Delete Group
                </button>
              ) : (
                <button className="danger" onClick={onLeaveClick}>
                  Leave Group
                </button>
              )}
            </div>
            {loading && <Loading size={2} />}
          </div>
          <MembersList
            id={data.group.id}
            ownerId={data.group.ownerId}
            onChatClick={onChatClick}
          />
        </>
      )}
      {data !== null && typeof data.message !== "undefined" && (
        <FlashMessage message={data.message} type={"success"} />
      )}
      {errors.map((error, index) => {
        return <FlashMessage message={error} type={"error"} key={index} />;
      })}
    </div>
  );
}
