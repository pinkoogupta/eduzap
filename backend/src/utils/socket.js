import { Server as SocketIOServer } from "socket.io";

let io = null;

// Initialize Socket.IO with HTTP server
export const initSocket = (server) => {
  io = new SocketIOServer(server, {
    cors: {
      origin: process.env.CORS_ORIGIN || "*",
      methods: ["GET", "POST", "DELETE"]
    }
  });

  io.on("connection", (socket) => {
    console.log("⚡ Client connected:", socket.id);

    socket.on("disconnect", () => {
      console.log("❌ Client disconnected:", socket.id);
    });
  });

  return io;
};

// Getter for controllers to emit events
export const getIO = () => {
  if (!io) throw new Error("Socket.IO not initialized. Call initSocket(server) first.");
  return io;
};
