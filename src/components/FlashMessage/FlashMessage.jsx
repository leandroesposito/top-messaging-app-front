import "./FlashMessage.css";
import PropTypes from "prop-types";
import { useEffect, useState } from "react";

export default function FlashMessage({ type, message }) {
  const [collapsed, setCollapsed] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setTimeout(() => setCollapsed(false), 10);
  }, []);

  function onCloseClick() {
    setCollapsed(true);
    setTimeout(() => {
      setRemoved(true);
    }, 1000);
  }

  if (removed) {
    return null;
  }

  return (
    <div className={`flash-message ${type} ${collapsed ? "collapsed" : ""}`}>
      <div className="message">{message}</div>{" "}
      <button
        aria-label="close"
        className="close-flash-message"
        onClick={onCloseClick}
      >
        X
      </button>
    </div>
  );
}

FlashMessage.propTypes = {
  type: PropTypes.oneOf(["error", "success"]),
  message: PropTypes.string,
};
