const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const cors = require("cors");

const app = express();
const server = http.createServer(app);

// CORS setup
const corsOptions = {
  origin: "http://localhost:3001", // Your frontend URL
  methods: ["GET", "POST"],
  credentials: true
};

app.use(cors(corsOptions));

const io = new Server(server, {
  cors: corsOptions
});

// Socket events
io.on("connection", (socket) => {
  console.log("✅ User connected:", socket.id);

  socket.on("join_room", (roomId) => {
    console.log(`🔗 ${socket.id} joined room: ${roomId}`);
    socket.join(roomId);
  });

  socket.on("send_message", (data) => {
    io.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("❌ User disconnected:", socket.id);
  });
});

// Start server
const PORT = 5050;
server.listen(PORT, () => {
  console.log(`🚀 Socket server running at http://localhost:${PORT}`);
});