import "./App.css";
import { BrowserRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import { SocketIoProvider } from "./context";
import { Host, Player } from "./pages";

function App() {
  // const [socket, setSocket] = useState<Socket>();

  // useEffect(() => {
  //   const newSocket = io(`http://127.0.0.1:7789`);
  //   setSocket(newSocket);
  // }, []);

  // const handleClick = () => {
  //   if (!socket) return;
  //   socket?.emit("test", { test: true });
  // };

  // socket?.on("test", (value) => console.log(value));

  return (
    <div className="App">
      <header>{/* <button>Emit test</button> */}</header>
      <SocketIoProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Outlet />}>
              <Route path="host" element={<Host />} />
              <Route path="play" element={<Player />} />
              <Route path="main-player" element={<div>I am the main player</div>} />
            </Route>
          </Routes>
        </Router>
      </SocketIoProvider>
    </div>
  );
}

export default App;
