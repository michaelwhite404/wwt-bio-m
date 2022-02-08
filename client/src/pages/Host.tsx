import React, { useEffect } from "react";
import { useSocketIo } from "../hooks";

export default function Host() {
  const socket = useSocketIo();

  useEffect(() => {}, []);
  return <div>I guess I'm the host. COOL!!</div>;
}
