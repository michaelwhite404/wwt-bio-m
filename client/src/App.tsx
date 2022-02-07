import React, { useEffect, useState } from "react";
import "./App.css";
import io, { Socket } from "socket.io-client";

function App() {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(`http://127.0.0.1:7789`);
    setSocket(newSocket);
  }, []);

  const handleClick = () => {
    socket?.emit("test", { test: true });
  };

  socket?.on("test", (value) => console.log(value));

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={handleClick}>Emit test</button>
      </header>
    </div>
  );
}

export default App;
