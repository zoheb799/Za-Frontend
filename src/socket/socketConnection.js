import { io } from "socket.io-client";

let socket = null;

export const connectWithSocketServer = ({ token }) => {
  if (!socket) {
    socket = io("http://localhost:5421", {
      auth: {
        token,
      },
      reconnectionAttempts: 5,
      transports: ["websocket"], // optional, forces WebSocket only
    });

    // Optional: listen to errors globally here
    socket.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err.message);
    });

    socket.on("connect", () => {
      console.log("✅ Connected to socket server");
    });
  }

  return socket;
};

export const sendDirectMessage = (data) => {
  if (socket) {
    socket.emit("new-message", data);
  }
};

export const getDirectChatHistory = (data) => {
  if (socket) {
    socket.emit("direct-chat-history", data);
  }
};

export default socket;
