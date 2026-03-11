import "./App.css";
import SigneduserScreen from "./components/SignedUserScreen/SigneduserScreen";
import UnsignedUser from "./components/UnsignedUserScreen/UnsignedUserScreen";
import { isLogedIn } from "./session/sessionManager";

function App() {
  return <>{!isLogedIn() ? <UnsignedUser /> : <SigneduserScreen />}</>;
}

export default App;
