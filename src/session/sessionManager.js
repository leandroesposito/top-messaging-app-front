function logIn({
  id,
  username,
  accessToken,
  refreshToken,
  friendCode,
  publicName,
}) {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
  localStorage.setItem("id", id);
  localStorage.setItem("username", username);
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
  localStorage.setItem("friendCode", friendCode);
  localStorage.setItem("publicName", publicName);
}

function logOut() {
  localStorage.removeItem("id");
  localStorage.removeItem("username");
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
  localStorage.removeItem("friendCode");
  localStorage.removeItem("publicName");
}

function isLogedIn() {
  return Boolean(getUserId());
}

function setAccessToken(token) {
  return localStorage.setItem("accessToken", token);
}

function getAccessToken() {
  return localStorage.getItem("accessToken");
}

function setRefreshToken(token) {
  return localStorage.setItem("refreshToken", token);
}

function getRefreshToken() {
  return localStorage.getItem("refreshToken");
}

function getUserId() {
  return parseInt(localStorage.getItem("id")) || null;
}

function getUsername() {
  return localStorage.getItem("username") || null;
}

function getFriendCode() {
  return localStorage.getItem("friendCode") || null;
}

function getPublicName() {
  return localStorage.getItem("publicName") || null;
}

function updateLastRefreshTime() {
  console.log("Token refreshed.");
  localStorage.setItem("lastRefreshTime", new Date().toISOString());
}

function getLastRefreshAge() {
  const lastRefresh = new Date(localStorage.getItem("lastRefreshTime"));
  const now = new Date();
  const elapsedTime = new Date(now.getTime() - lastRefresh.getTime());

  return elapsedTime.getTime();
}

function updateLastRequestTime() {
  localStorage.setItem("lastRequestTime", new Date().toISOString());
}

function getLastRequestAge() {
  const lastRequest = new Date(localStorage.getItem("lastRequestTime"));
  const now = new Date();
  const elapsedTime = new Date(now.getTime() - lastRequest.getTime());

  return elapsedTime.getTime();
}

function refreshCooldownPassed() {
  return getLastRequestAge() > 10000;
}

function isNewToken() {
  return getLastRefreshAge() < 15 * 60 * 10000;
}

function refreshTokens() {
  if (!refreshCooldownPassed()) {
    console.log("Waiting for token update.");
    return new Promise((resolve) => {
      const intervalId = setInterval(() => {
        if (isNewToken()) {
          console.log("Token updated.");
          clearInterval(intervalId);
          resolve(true);
        }
      }, 100);
    });
  }

  const options = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: getRefreshToken(),
    }),
  };

  updateLastRequestTime();
  return fetch(
    "https://top-messaging-app-server.onrender.com/api/auth/refresh",
    options,
  )
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
      updateLastRefreshTime();
    })
    .catch((error) => {
      console.error("FETCH ERROR", error);
      if (error.message.startsWith("NetworkError")) {
        return { errors: [error.message] };
      }
    });
}

export {
  logIn,
  logOut,
  isLogedIn,
  setAccessToken,
  getAccessToken,
  setRefreshToken,
  getRefreshToken,
  refreshTokens,
  getUserId,
  getUsername,
  getFriendCode,
  getPublicName,
};
