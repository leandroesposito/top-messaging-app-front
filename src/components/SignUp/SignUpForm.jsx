import { useEffect, useState } from "react";
import Required from "../Form/Required";
import FormRow from "../Form/FormRow";
import { setValidationResult } from "../Form/FormValidation";
import useFetch from "../../hooks/useFetch";
import FlashMessage from "../FlashMessage/FlashMessage";
import Loading from "../Loading/Loading";
import "./SignUpForm.css";

export default function SignUpForm({ onSignUpSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, data, errors, makeRequest] = useFetch();
  const [viewPassword, setViewPassword] = useState(false);

  useEffect(() => {
    let redirectTimeout = null;
    if (data && data.success) {
      redirectTimeout = setTimeout(() => {
        onSignUpSuccess();
      }, 3000);
    }

    return () => {
      if (redirectTimeout) {
        clearTimeout(redirectTimeout);
      }
    };
  }, [data, onSignUpSuccess]);

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
    } else if (usernameElem.validity.tooShort) {
      setValidationResult(
        usernameElem,
        "Username must be at least 4 characters.",
      );
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
    } else if (passwordElem.validity.tooShort) {
      setValidationResult(
        passwordElem,
        "Password must be at least 8 characters.",
      );
    } else {
      setValidationResult(passwordElem, "");
      return true;
    }

    return false;
  }

  function onConfirmpasswordChange(event) {
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

    if (password != (newConfirmPassword || confirmPassword)) {
      setValidationResult(
        confirmPasswordElem,
        "Password and Confirm password don't match.",
      );
    } else {
      setValidationResult(confirmPasswordElem, "");
      return true;
    }

    return false;
  }

  function onSubmitClick() {
    validateUsername();
    validatePassword();
    validateConfirmPassword();
  }

  function onSubmit(event) {
    event.preventDefault();

    if (data && data.success) {
      return;
    }

    const validUsername = validateUsername();
    const validPassword = validatePassword();
    const validConfirmPassword = validateConfirmPassword();

    if (!validUsername || !validPassword || !validConfirmPassword) {
      return false;
    }

    const formData = new FormData(event.target);

    makeRequest("/auth/sign-up", "POST", false, Object.fromEntries(formData));
  }

  function onPasswordVisibilityClick() {
    setViewPassword(!viewPassword);
  }

  return (
    <div className="signup-form auth-form-container">
      <form onSubmit={onSubmit} className="auth-form form">
        <h2>Sign Up</h2>
        <FormRow>
          <label htmlFor="username">
            Username <Required />
          </label>
          <input
            type="text"
            name="username"
            id="username"
            value={username}
            onChange={onUsernameChange}
            onBlur={validateUsername}
            minLength={4}
            maxLength={10}
            required
          />
        </FormRow>

        <FormRow>
          <label htmlFor="password">
            Password <Required />
          </label>
          <input
            type={viewPassword ? "text" : "password"}
            name="password"
            id="password"
            value={password}
            onChange={onPasswordChange}
            onBlur={validatePassword}
            minLength={8}
            required
          />
          <button
            className="view-password"
            type="button"
            onClick={onPasswordVisibilityClick}
          >
            {viewPassword ? "Hide" : "View"}
          </button>
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
            onChange={onConfirmpasswordChange}
            onBlur={onConfirmPasswordFocusOut}
            required
          />
        </FormRow>
        <div className="buttons">
          <button type="submit" onClick={onSubmitClick} disabled={loading}>
            Submit
          </button>
        </div>
        {loading && <Loading size={4} />}
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
