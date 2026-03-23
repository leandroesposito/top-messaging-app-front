import { useState } from "react";
import useFetch from "../../../../hooks/useFetch";
import { setValidationResult } from "../../../Form/FormValidation";
import FormRow from "../../../Form/FormRow";
import Required from "../../../Form/Required";
import FlashMessage from "../../../FlashMessage/FlashMessage";

export default function PasswordForm() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, data, errors, makeRequest] = useFetch();

  function onCurrentPasswordChange(event) {
    const currentPasswordElem = event.target;
    if (currentPasswordElem.value.includes(" ")) {
      return;
    }
    setCurrentPassword(currentPasswordElem.value);

    validateCurrentPassword(event);
  }

  function validateCurrentPassword() {
    const currentPasswordElem = document.querySelector(
      "input#current-password",
    );
    if (currentPasswordElem.validity.valueMissing) {
      setValidationResult(currentPasswordElem, "Current password is required.");
    } else {
      setValidationResult(currentPasswordElem, "");
      return true;
    }

    return false;
  }

  function onNewPasswordChange(event) {
    const newPasswordElem = event.target;
    setNewPassword(newPasswordElem.value);

    validateNewPassword(event);
  }

  function validateNewPassword() {
    const newPasswordElem = document.querySelector("input#new-password");

    if (newPasswordElem.validity.valueMissing) {
      setValidationResult(newPasswordElem, "Password is required.");
    } else if (newPasswordElem.validity.tooShort) {
      setValidationResult(
        newPasswordElem,
        "New password must be at least 8 characters.",
      );
    } else {
      setValidationResult(newPasswordElem, "");
      return true;
    }

    return false;
  }

  function onConfirmPasswordChange(event) {
    const confirmPasswordElem = event.target;
    const newConfirmPassword = confirmPasswordElem.value;
    setConfirmPassword(newConfirmPassword);

    validateConfirmPassword(newConfirmPassword);
  }

  function onConfirmPasswordFocusOut() {
    validateConfirmPassword();
  }

  function validateConfirmPassword(newConfirmPassword = null) {
    const confirmPasswordElem = document.querySelector("#confirm-password");

    if (newPassword != (newConfirmPassword || confirmPassword)) {
      setValidationResult(confirmPasswordElem, "Confirm password don't match.");
    } else {
      setValidationResult(confirmPasswordElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateCurrentPassword();
    validateNewPassword();
    validateConfirmPassword();
  }

  function onSubmit(event) {
    event.preventDefault();

    const validCurrentPassword = validateCurrentPassword();
    const validNewPassword = validateNewPassword();
    const validConfirmPassword = validateConfirmPassword();

    if (!validCurrentPassword || !validNewPassword || !validConfirmPassword) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/auth/password", "PUT", true, Object.fromEntries(formData));
  }

  return (
    <div className="form-container">
      <form onSubmit={onSubmit} className="form">
        <h2>Password</h2>
        <FormRow>
          <label htmlFor="current-password">
            Current Password <Required />
          </label>
          <input
            type="password"
            name="current-password"
            id="current-password"
            value={currentPassword}
            onChange={onCurrentPasswordChange}
            onBlur={validateCurrentPassword}
            required
          />
        </FormRow>

        <FormRow>
          <label htmlFor="new-password">
            New Password <Required />
          </label>
          <input
            type="password"
            name="new-password"
            id="new-password"
            value={newPassword}
            onChange={onNewPasswordChange}
            onBlur={validateNewPassword}
            minLength={8}
            required
          />
        </FormRow>
        <FormRow>
          <label htmlFor="confirm-password">
            Confirm password <Required />
          </label>
          <input
            type="password"
            name="confirm-password"
            id="confirm-password"
            value={confirmPassword}
            onChange={onConfirmPasswordChange}
            onBlur={onConfirmPasswordFocusOut}
            required
          />
        </FormRow>
        <div className="buttons">
          <button type="submit" onClick={onSubmitClick} disabled={loading}>
            Submit
          </button>
        </div>
      </form>
      <div className="flash-messages">
        {errors.map((error, index) => (
          <FlashMessage message={error} type={"error"} key={index} />
        ))}
        {data !== null && typeof data.message !== "undefined" && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
    </div>
  );
}
