import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import useAuthStore from "../zustand/useAuthStore";

const useGetConversations = () => {
  const [loading, setLoading] = useState(false);
  const [conversations, setConversations] = useState([]);
  const { authUser } = useAuthStore();

  useEffect(() => {
    const getConversations = async () => {
      if (!authUser) return;
      
      setLoading(true);
      try {
        const res = await fetch("/api/users", {
          credentials: "include" 
        });
        
        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.message || "Error fetching conversations");
        }
        
        const data = await res.json();
        setConversations(data);
      } catch (error) {
        toast.error(error.message);
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };

    getConversations();
  }, [authUser]);

  return { loading, conversations };
};

export default useGetConversations;