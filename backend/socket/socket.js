import { Server } from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ["http://localhost:5173"],
    methods: ["GET", "POST"],
  },
});

const userSocketMap = {}; 


export const getReceiverSocketId = (receiverId) => {
  return userSocketMap[receiverId];
};


io.on("connection", (socket) => {
  console.log("a user connected", socket.id);

  const userId = socket.handshake.query.userId;
  if (userId != "undefined") userSocketMap[userId] = socket.id;

  
  console.log("Current connected users:", userSocketMap);
  
  io.emit("getOnlineUsers", Object.keys(userSocketMap));

  
  socket.on("typing", (data) => {
    console.log("Typing event received:", data);
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      console.log(`Sending typing event to ${data.receiverId} via socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("typing", data);
    }
  });

  socket.on("stopTyping", (data) => {
    console.log("Stop typing event received:", data);
    const receiverSocketId = getReceiverSocketId(data.receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("stopTyping", data);
    }
  });

  socket.on("groupTyping", (data) => {
    console.log("Group typing event received:", data);
    socket.broadcast.emit("groupTyping", data);
  });

  socket.on("groupStopTyping", (data) => {
    console.log("Group stop typing event received:", data);
    socket.broadcast.emit("groupStopTyping", data);
  });

  socket.on("disconnect", () => {
    console.log("user disconnected", socket.id);
    delete userSocketMap[userId];
    io.emit("getOnlineUsers", Object.keys(userSocketMap));
  });
});

export { app, io, server };
