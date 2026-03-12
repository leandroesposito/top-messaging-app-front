import JoinGroupForm from "./JoinGroupForm";

export default function JoinGroup({ display }) {
  if (!display) {
    return null;
  }

  return (
    <div className="join-group-container">
      <JoinGroupForm />
    </div>
  );
}
