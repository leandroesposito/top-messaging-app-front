import { useState } from "react";
import { getAccessToken, refreshTokens } from "../session/sessionManager";

const domain = "http://localhost:3000/api";

function useFetch() {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);
  const [errors, setErrors] = useState([]);

  async function makeRequest(
    route,
    method = "GET",
    authenticate = false,
    body = null,
  ) {
    setLoading(true);
    setData(null);
    const options = {
      method,
      mode: "cors",
      headers: { "Content-Type": "application/json" },
    };

    if (body) {
      options.body = JSON.stringify(body);
    }

    if (authenticate) {
      options.headers.Authorization = getAccessToken();
    }

    try {
      const endpoint = domain + route;
      const response = await fetch(endpoint, options);

      if (response.status == 404) {
        setLoading(false);
        return ["Endpoint not found"];
      }

      if (response.status == 500) {
        setLoading(false);
        return ["Server error"];
      }
      const json = await response.json();

      if (response.status == 401) {
        if (json.errors && json.errors[0].startsWith("Access token expired")) {
          await refreshTokens();
          return await makeRequest(route, method, authenticate, body);
        }
      } else if (json.errors) {
        setErrors([...errors, json.errors]);
      } else {
        setData(json);
      }
      return setLoading(false);
    } catch (error) {
      console.error("FETCH ERROR", error);
      if (error.message.startsWith("NetworkError")) {
        setErrors([error.message]);
      }
      return setLoading(false);
    }
  }

  return [loading, data, errors, makeRequest];
}

export default useFetch;
