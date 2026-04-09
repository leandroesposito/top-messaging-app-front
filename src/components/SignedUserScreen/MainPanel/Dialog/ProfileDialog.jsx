import { useEffect } from "react";
import useFetch from "../../../../hooks/useFetch";
import Loading from "../../../Loading/Loading";
import FlashMessage from "../../../FlashMessage/FlashMessage";
import { getUserId } from "../../../../session/sessionManager";

export default function ProfileDialog({ id, onCloseDialog }) {
  const [loading, data, errors, makeRequest] = useFetch();

  useEffect(() => {
    makeRequest(`/users/${id}/profile`);
  }, [makeRequest, id]);

  function onDeleteClick() {
    if (
      confirm(
        `Are you sure you want to delete ${data.publicName} from your friends list? this wont delete the messages.`,
      )
    ) {
      makeRequest(`/users/friends/${id}`, "DELETE", true);
    }
  }

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

  return (
    <>
      {loading && <Loading />}
      {data !== null && typeof data.publicName !== "undefined" && (
        <>
          <h2 id="dialog-title">{data.publicName}</h2>
          <p>{data.description}</p>
          <div className="buttons">
            {data.userId !== getUserId() && (
              <button className="danger" onClick={onDeleteClick}>
                Delete Friend
              </button>
            )}
          </div>
          {loading && <Loading size={2} />}
        </>
      )}
      {data !== null && typeof data.message !== "undefined" && (
        <FlashMessage message={data.message} type={"success"} />
      )}
      {errors.map((error, index) => {
        return <FlashMessage message={error} type={"error"} key={index} />;
      })}
    </>
  );
}
