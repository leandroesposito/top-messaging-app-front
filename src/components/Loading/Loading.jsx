import styles from "./Loading.module.css";

export default function Loading({ size }) {
  return (
    <div
      className="loading-container"
      style={{
        fontSize: `${size}rem`,
        justifySelf: "center",
        alignSelf: "center",
      }}
    >
      <div className={styles.loading}></div>
    </div>
  );
}
