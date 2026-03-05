import "./App.css";
import UnsignedUser from "./components/UnsignedUserScreen/UnsignedUserScreen";
import { isLogedIn } from "./session/sessionManager";

function App() {
  return <>{!isLogedIn() ? <UnsignedUser /> : null}</>;
}

export default App;
