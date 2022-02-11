import "./App.css";
import { BrowserRouter as Router, Outlet, Route, Routes } from "react-router-dom";
import { SocketIoProvider } from "./context";
import { Host, Player, MainPlayer } from "./pages";

function App() {
  return (
    <SocketIoProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Outlet />}>
            <Route path="host" element={<Host />} />
            <Route path="play" element={<Player />} />
            <Route path="main-player" element={<MainPlayer />} />
          </Route>
        </Routes>
      </Router>
    </SocketIoProvider>
  );
}

export default App;
