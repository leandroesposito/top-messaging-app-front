import { useEffect } from "react";
import useFetch from "../../hooks/useFetch";
import {
  getPublicName,
  getRefreshToken,
  getUserId,
  getUsername,
  isLogedIn,
  logOut,
} from "../../session/sessionManager";
import "./Header.css";
import { LogOut } from "lucide-react";

export default function Header({ onSignUpClick, onLogInClick, onChatClick }) {
  const [loading, data, , makeRequest] = useFetch();

  useEffect(() => {
    if (data && data.success) {
      window.location.reload();
    }
  }, [data]);

  function onLogOutClick() {
    makeRequest("/auth/log-out", "POST", true, {
      refreshToken: getRefreshToken(),
    });
    logOut();
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
              <button
                className="username-button"
                data-type="profile"
                data-id={getUserId()}
                data-name={getPublicName()}
                onClick={onChatClick}
              >
                {getUsername()}
              </button>
              <button
                className="log-out-button"
                onClick={onLogOutClick}
                disabled={loading}
                aria-label="Log out"
              >
                <LogOut />
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
