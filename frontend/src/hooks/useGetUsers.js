import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../zustand/useAuthStore";

const useGetUsers = () => {
  const [loading, setLoading] = useState(false);
  const [users, setUsers] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const getUsers = async () => {
      if (!authUser) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/users", {
          credentials: "include" 
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error fetching users");
        }
        
        const data = await res.json();
        setUsers(data);
      } catch (error) {
        toast.error(error.message);
        setUsers([]);
      } finally {
        setLoading(false);
      }
    };

    getUsers();
  }, [authUser]);

  return { loading, users };
};

export default useGetUsers;