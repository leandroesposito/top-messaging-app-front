import { useEffect } from "react";
import useFetch from "../../../../hooks/useFetch";
import Loading from "../../../Loading/Loading";
import FlashMessage from "../../../FlashMessage/FlashMessage";
import { getUserId } from "../../../../session/sessionManager";

export default function ProfileDialog({ id }) {
  const [loading, data, errors, makeRequest] = useFetch();

  useEffect(() => {
    makeRequest(`/users/${id}/profile`);
  }, [makeRequest, id]);

  function onDeleteClick() {
    makeRequest(`/users/friends/${id}`, "DELETE", true);
  }

  return (
    <div className="dialog-content">
      {loading && <Loading />}
      {data !== null && typeof data.publicName !== "undefined" && (
        <>
          <h2>{data.publicName}</h2>
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
    </div>
  );
}
