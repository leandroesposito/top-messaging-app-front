import { useState } from "react";
import LogInForm from "../LogIn/LogInForm";
import SignUpForm from "../SignUp/SignUpForm";
import Header from "../Header/Header";
import "../Form/FormScreen.css";

export default function UnsignedUser() {
  const [viewLogIn, setViewLogIn] = useState(true);
  const [viewSignUp, setViewSignUp] = useState(false);

  function onLogInClick() {
    setViewLogIn(true);
    setViewSignUp(false);
  }

  function onSignUpClick() {
    setViewLogIn(false);
    setViewSignUp(true);
  }

  return (
    <div className="form-screen">
      <Header onLogInClick={onLogInClick} onSignUpClick={onSignUpClick} />
      {viewLogIn ? (
        <LogInForm />
      ) : viewSignUp ? (
        <SignUpForm onSignUpSuccess={onLogInClick} />
      ) : (
        "error"
      )}
    </div>
  );
}
