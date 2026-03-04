import Header from "../Header/Header";
import SignUpForm from "./SignUpForm";
import "../Form/FormScreen.css";

export default function SignUp() {
  return (
    <div className="form-screen">
      <Header />
      <SignUpForm />
    </div>
  );
}
