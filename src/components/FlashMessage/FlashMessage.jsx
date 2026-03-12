import "./FlashMessage.css";
import { useEffect, useState } from "react";

export default function FlashMessage({ type, message }) {
  const [collapsed, setCollapsed] = useState(true);
  const [removed, setRemoved] = useState(false);

  useEffect(() => {
    setTimeout(() => setCollapsed(false), 10);
  }, []);

  useEffect(() => {
    setTimeout(() => {
      setRemoved(false);
      setTimeout(() => {
        setCollapsed(false);
      }, 10);
    }, 10);
  }, [message]);

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
