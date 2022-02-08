import React, { createContext, ReactNode, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

export const SocketIoContext = createContext<Socket | undefined>(undefined);

export default function SocketIoProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<Socket>();

  useEffect(() => {
    const newSocket = io(`http://127.0.0.1:7789`);
    setSocket(newSocket);
  }, []);

  return <SocketIoContext.Provider value={socket}>{children}</SocketIoContext.Provider>;
}
