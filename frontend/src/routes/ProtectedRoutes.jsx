import { Navigate, Outlet } from "react-router-dom";
import useAuthStore from "../zustand/useAuthStore";

export const ProtectedRoute = () => {
  const { authUser } = useAuthStore();
  
  if (!authUser) {
    return <Navigate to="/login" replace />;
  }
  
  return <Outlet />;
};


export const AuthRoute = () => {
  const { authUser } = useAuthStore();
  
  if (authUser) {
    return <Navigate to="/" replace />;
  }
  
  return <Outlet />;
};