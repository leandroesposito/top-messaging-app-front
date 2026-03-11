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
  return localStorage.getItem("id") || null;
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

function refreshTokens() {
  const options = {
    method: "POST",
    mode: "cors",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      refreshToken: getRefreshToken(),
    }),
  };

  return fetch("http://localhost:3000/api/auth/refresh", options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      setAccessToken(data.accessToken);
      setRefreshToken(data.refreshToken);
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
