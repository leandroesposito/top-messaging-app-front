import { useEffect, useState } from "react";
import FormRow from "../Form/FormRow";
import useFetch from "../../hooks/useFetch";
import FlashMessage from "../FlashMessage/FlashMessage";
import { setValidationResult } from "../Form/FormValidation";
import { logIn } from "../../session/sessionManager";

export default function LogInForm() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, data, errors, makeRequest] = useFetch();

  useEffect(() => {
    let timeoutId = null;
    if (data && data.id) {
      logIn(data);

      timeoutId = setTimeout(() => {
        window.location.reload();
      }, 3000);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [data]);

  function onUsernameChange(event) {
    const usernameElem = event.target;
    if (usernameElem.value.includes(" ")) {
      return;
    }
    setUsername(usernameElem.value);

    validateUsername(event);
  }

  function validateUsername() {
    const usernameElem = document.querySelector("input#username");
    if (usernameElem.validity.valueMissing) {
      setValidationResult(usernameElem, "Username is required.");
    } else if (usernameElem.validity.tooLong) {
      setValidationResult(
        usernameElem,
        "Username can't be longer than 10 characters.",
      );
    } else {
      setValidationResult(usernameElem, "");
      return true;
    }

    return false;
  }

  function onPasswordChange(event) {
    const passwordElem = event.target;
    setPassword(passwordElem.value);

    validatePassword(event);
  }

  function validatePassword() {
    const passwordElem = document.querySelector("input#password");

    if (passwordElem.validity.valueMissing) {
      setValidationResult(passwordElem, "Password is required.");
    } else {
      setValidationResult(passwordElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateUsername();
    validatePassword();
  }

  function onSubmit(event) {
    event.preventDefault();

    if (data && data.id) {
      return;
    }

    const validUsername = validateUsername();
    const validPassword = validatePassword();

    if (!validUsername || !validPassword) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/auth/log-in", "POST", false, Object.fromEntries(formData));
  }

  return (
    <div className="login-form auth-form-container">
      <form onSubmit={onSubmit} className="auth-form">
        <h2>Log in</h2>
        <FormRow>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onUsernameChange}
            onBlur={validateUsername}
            maxLength={10}
            required
          />
        </FormRow>

        <FormRow>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            name="password"
            id="password"
            value={password}
            onChange={onPasswordChange}
            onBlur={validatePassword}
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
        {data !== null && data.message !== null && (
          <FlashMessage message={data.message} type={"success"} />
        )}
      </div>
    </div>
  );
}
