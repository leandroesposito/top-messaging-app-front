import { useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { setValidationResult } from "../../../Form/FormValidation";
import FormRow from "../../../Form/FormRow";
import FlashMessage from "../../../FlashMessage/FlashMessage";

export default function JoinGroupForm() {
  const [inviteCode, setInviteCode] = useState("");
  const [loading, data, errors, makeRequest] = useFetch();

  function onInviteCodeChange(event) {
    const inviteCodeElem = event.target;
    if (inviteCodeElem.value.includes(" ")) {
      return;
    }
    setInviteCode(inviteCodeElem.value);

    validateInviteCode(event);
  }

  function validateInviteCode() {
    const inviteCodeElem = document.querySelector("input#invite-code");
    if (inviteCodeElem.validity.valueMissing) {
      setValidationResult(inviteCodeElem, "Invite code is required.");
    } else {
      setValidationResult(inviteCodeElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateInviteCode();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validInviteCode = validateInviteCode();

    if (!validInviteCode) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest(`/groups/join/${formData.get("invite-code")}`, "POST", true);
  }

  return (
    <div className="join-group-form">
      <form onSubmit={onSubmit} className="chats-panel-form form">
        <h3>Join group</h3>
        <FormRow>
          <label htmlFor="invite-code">Invite code</label>
          <input
            type="text"
            name="invite-code"
            id="invite-code"
            value={inviteCode}
            onChange={onInviteCodeChange}
            onBlur={validateInviteCode}
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
