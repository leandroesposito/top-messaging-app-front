import { useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import FlashMessage from "../../../FlashMessage/FlashMessage";
import "./NewMessageForm.css";

export default function NewMessageForm({ currentChat }) {
  const [body, setBody] = useState("");
  const [loading, , errors, makeRequest] = useFetch();

  function onBodyChange(event) {
    const bodyElem = event.target;
    setBody(bodyElem.value);
  }

  function validateBody() {
    const bodyElem = document.querySelector("textarea#body");
    if (bodyElem.value.trim() === "") {
      return false;
    } else {
      return true;
    }
  }

  function onSubmitClick() {
    validateBody();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validBody = validateBody();

    if (!validBody) {
      return false;
    }

    const formData = new FormData(event.target.closest("form"));
    const reqBody = { body: formData.get("body") };

    if (currentChat.type === "group") {
      makeRequest(`/groups/${currentChat.id}/messages`, "POST", true, reqBody);
    } else if (currentChat.type === "friend") {
      makeRequest(`/messages/${currentChat.id}`, "POST", true, reqBody);
    }
    setBody("");
  }

  function handleKeyDown(event) {
    if (event.keyCode == 13 && !(event.shiftKey || event.ctrlKey)) {
      onSubmit(event);
    }
  }

  return (
    <div className="new-message-form-container">
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
      </div>
      <form onSubmit={onSubmit} className="mew-message-form">
        <textarea
          aria-label="message"
          type="text"
          name="body"
          id="body"
          onChange={onBodyChange}
          onKeyDown={handleKeyDown}
          onBlur={validateBody}
          rows={1}
          required
          value={body}
        ></textarea>
        <pre className="sizer">{body}</pre>
        <button
          type="submit"
          className="flat"
          onClick={onSubmitClick}
          disabled={loading}
        >
          Submit
        </button>
      </form>
    </div>
  );
}
