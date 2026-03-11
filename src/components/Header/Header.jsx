import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import {
  getRefreshToken,
  getUsername,
  isLogedIn,
  logOut,
} from "../../session/sessionManager";
import "./Header.css";

export default function Header({ onSignUpClick, onLogInClick }) {
  const [loading, data, , makeRequest] = useFetch();

  useEffect(() => {
    if (data && data.success) {
      logOut();
      window.location.reload();
    }
  }, [data]);

  function onLogOutClick() {
    makeRequest("/auth/log-out", "POST", true, {
      refreshToken: getRefreshToken(),
    });
  }

  return (
    <header className={`header ${isLogedIn() == true && "small"}`}>
      <div className="left">
        <h1>The Chat</h1>
      </div>
      <div className="right">
        <div className="buttons">
          {isLogedIn() ? (
            <>
              <button className="username-button" disabled>
                {getUsername()}
              </button>
              <button
                className="log-out-button"
                onClick={onLogOutClick}
                disabled={loading}
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <button className="sign-up-button" onClick={onSignUpClick}>
                Sign up
              </button>
              <button className="login-button" onClick={onLogInClick}>
                Log in
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
