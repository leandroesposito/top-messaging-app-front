import "./App.css";
import SigneduserScreen from "./components/SignedUserScreen/SigneduserScreen";
import UnsignedUser from "./components/UnsignedUserScreen/UnsignedUserScreen";
import useFetch from "./hooks/useFetch";
import { isLogedIn } from "./session/sessionManager";

function App() {
  const [, , , makeRequest] = useFetch();

  // used to wake up the free server only on free version
  useEffect(() => {
    makeRequest("/");
  }, []);

  return <>{!isLogedIn() ? <UnsignedUser /> : <SigneduserScreen />}</>;
}

export default App;
