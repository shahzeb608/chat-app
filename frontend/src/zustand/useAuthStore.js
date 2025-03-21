import { create } from "zustand";
import { persist } from "zustand/middleware";
import toast from "react-hot-toast";

const useAuthStore = create(
  persist(
    (set, get) => ({
      authUser: null,
      loading: false,
      
      setAuthUser: (user) => set({ authUser: user }),
      
      login: async (username, password) => {
        if (!username || !password) {
          toast.error("Please fill in all fields");
          return;
        }
        
        set({ loading: true });
        try {
          console.log("Attempting login with:", { username });
          
          const res = await fetch("/api/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
            credentials: "include"
          });
          
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Login failed");
          }
          
          set({ authUser: data });
          
          // Verify auth
          const verifyRes = await fetch("/api/auth/verify", {
            credentials: "include"
          });
          
          if (!verifyRes.ok) {
            console.warn("Auth verification failed after login");
          } else {
            console.log("Auth verification successful");
          }
          
          toast.success("Logged in successfully!");
        } catch (error) {
          console.error("Login error:", error);
          toast.error(error.message || "Login failed");
        } finally {
          set({ loading: false });
        }
      },
      
      signup: async ({ fullName, username, password, confirmPassword, gender }) => {
        if (!fullName || !username || !password || !confirmPassword || !gender) {
          toast.error("Please fill in all fields");
          return;
        }
        
        if (password !== confirmPassword) {
          toast.error("Passwords do not match");
          return;
        }
        
        if (password.length < 6) {
          toast.error("Password must be at least 6 characters");
          return;
        }
        
        set({ loading: true });
        try {
          const res = await fetch("/api/auth/signup", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ 
              fullName, 
              username, 
              password, 
              confirmPassword, 
              gender 
            }),
            credentials: "include"
          });
          
          const data = await res.json();
          if (!res.ok) {
            throw new Error(data.message || "Failed to complete the request");
          }
          
          set({ authUser: data });
          
          toast.success("Signed up successfully!");
        } catch (error) {
          toast.error(error.message);
        } finally {
          set({ loading: false });
        }
      },
      
      logout: async () => {
        set({ loading: true });
        try {
          const res = await fetch("/api/auth/logout", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include"
          });
          
          const data = await res.json();
          if (data.error) {
            throw new Error(data.error);
          }
          
          set({ authUser: null });
        } catch (error) {
          toast.error(error.message);
        } finally {
          set({ loading: false });
        }
      },
      
      verifyAuth: async () => {
        const { authUser } = get();
        if (!authUser) return;
        
        try {
          console.log("Verifying authentication status");
          const res = await fetch("/api/auth/verify", {
            credentials: "include"
          });
          
          if (!res.ok) {
            console.warn("Auth verification failed, clearing user data");
            set({ authUser: null });
            toast.error("Session expired, please login again");
          } else {
            console.log("Auth verification successful");
          }
        } catch (error) {
          console.error("Auth verification error:", error);
          set({ authUser: null });
        }
      }
    }),
    {
      name: "chat-user-storage",
      partialize: (state) => ({ authUser: state.authUser })
    }
  )
);

export default useAuthStore;