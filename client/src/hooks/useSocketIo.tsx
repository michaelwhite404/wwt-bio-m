import { useContext } from "react";
import { SocketIoContext } from "../context/SocketIoProvider";

const useSocketIo = () => useContext(SocketIoContext);
export default useSocketIo;
