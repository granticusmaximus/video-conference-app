import { io } from "socket.io-client";

const SOCKET_SERVER_URL = "http://localhost:5050";  // Change if using a different backend

const socket = io(SOCKET_SERVER_URL, { transports: ["websocket"] });

export default socket;