import { useEffect } from "react";
import { Navigate, Route, Routes } from "react-router-dom";
import "./App.css";
import Home from "./pages/home/Home";
import Login from "./pages/login/Login";
import SignUp from "./pages/signup/SignUp";
import { Toaster } from "react-hot-toast";
import useAuthStore from "./zustand/useAuthStore";
import useSocketStore from "./zustand/useSocketStore";
import { ProtectedRoute, AuthRoute } from "./routes/ProtectedRoutes";

function App() {
  const { authUser, verifyAuth } = useAuthStore();
  const { connectSocket, disconnectSocket } = useSocketStore();
  
  
  useEffect(() => {
    verifyAuth();
  }, [verifyAuth]);
  
  useEffect(() => {
    if (authUser) {
      connectSocket();
    } else {
      disconnectSocket();
    }
    
    return () => {
      disconnectSocket();
    };
  }, [authUser, connectSocket, disconnectSocket]);
  
  return (
    <div className="p-4 h-screen flex items-center justify-center">
      <Routes>
        
        <Route element={<ProtectedRoute />}>
          <Route path="/" element={<Home />} />
        </Route>
        
    
        <Route element={<AuthRoute />}>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<SignUp />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <Toaster />
    </div>
  );
}

export default App;