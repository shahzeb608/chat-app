import { create } from "zustand";
import io from "socket.io-client";
import useAuthStore from "./useAuthStore";

const useSocketStore = create((set, get) => ({
  socket: null,
  onlineUsers: [],
  
  
connectSocket: () => {
    const authUser = useAuthStore.getState().authUser;
    const { socket: existingSocket } = get();
    
    if (existingSocket) {
      console.log("Closing existing socket connection");
      existingSocket.close();
    }
    
    if (!authUser) {
      console.log("No auth user, not connecting socket");
      return;
    }
    
    console.log("Connecting socket for user:", authUser._id);
    
    const socket = io("http://localhost:8000", {
      query: {
        userId: authUser._id,
      },
      reconnection: true,
      reconnectionAttempts: 10,
      reconnectionDelay: 1000,
      timeout: 10000,
    });
    
    socket.on("connect", () => {
      console.log("Socket connected with ID:", socket.id);
    });
    
    socket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });
    
    socket.on("reconnect", (attemptNumber) => {
      console.log("Socket reconnected after", attemptNumber, "attempts");
    });
    
    socket.on("getOnlineUsers", (users) => {
      console.log("Online users updated:", users);
      set({ onlineUsers: users });
    });
    
    socket.on("disconnect", (reason) => {
      console.log("Socket disconnected:", reason);
      
      setTimeout(() => {
        console.log("Attempting to reconnect socket...");
        get().connectSocket();
      }, 1000);
    });
    
    set({ socket });
  },
  
  disconnectSocket: () => {
    const { socket } = get();
    if (socket) {
      socket.close();
      set({ socket: null, onlineUsers: [] });
    }
  }
}));

export default useSocketStore;