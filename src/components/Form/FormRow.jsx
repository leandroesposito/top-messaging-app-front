import "./FormRow.css";

export default function FormRow({ children }) {
  return (
    <div className="form-row">
      <div className="form-row-content">{children}</div>
      <div className="validation-result"></div>
    </div>
  );
}
