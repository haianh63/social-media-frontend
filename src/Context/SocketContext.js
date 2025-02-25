import { createContext } from "react";
import { socket } from "../../utils";

export const SocketContext = createContext(socket);
