import { useEffect, useRef, useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { setValidationResult } from "../../../Form/FormValidation";
import FormRow from "../../../Form/FormRow";
import FlashMessage from "../../../FlashMessage/FlashMessage";
import Loading from "../../../Loading/Loading";

export default function AddFriendForm({ onCloseAddFriend }) {
  const [friendCode, setFriendCode] = useState("");
  const [loading, data, errors, makeRequest] = useFetch();
  const inputRef = useRef();

  function onFriendCodeChange(event) {
    const friendCodeElem = event.target;
    if (friendCodeElem.value.includes(" ")) {
      return;
    }
    setFriendCode(friendCodeElem.value);

    validateFriendCode(event);
  }

  function validateFriendCode() {
    const friendCodeElem = document.querySelector("input#friend-code");
    if (friendCodeElem.validity.valueMissing) {
      setValidationResult(friendCodeElem, "Friend code is required.");
    } else {
      setValidationResult(friendCodeElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateFriendCode();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validFriendCode = validateFriendCode();

    if (!validFriendCode) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest(`/users/friends/${formData.get("friend-code")}`, "POST", true);
    setFriendCode("");
  }

  useEffect(() => {
    if (data !== null && typeof data.message !== "undefined") {
      setTimeout(onCloseAddFriend, 2000);
    }
  }, [data, onCloseAddFriend]);

  useEffect(() => {
    setTimeout(() => {
      inputRef.current.focus();
    });
  }, []);

  return (
    <div className="add-fiend-form">
      <form onSubmit={onSubmit} className="chats-panel-form form">
        <h3>Add Friend</h3>
        <FormRow>
          <label htmlFor="friend-code">Friend code</label>
          <input
            type="text"
            name="friend-code"
            id="friend-code"
            value={friendCode}
            onChange={onFriendCodeChange}
            onBlur={validateFriendCode}
            ref={inputRef}
            required
          />
        </FormRow>
        <div className="buttons">
          <button
            type="submit"
            className="flat"
            onClick={onSubmitClick}
            disabled={loading}
          >
            Submit
          </button>
        </div>
        {loading && <Loading size={3} />}
      </form>
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
        {data !== null && data.message !== null && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
    </div>
  );
}
