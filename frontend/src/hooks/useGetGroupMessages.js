import { useEffect, useState } from "react";
import useGroupStore from "../zustand/useGroupStore";
import toast from "react-hot-toast";

const useGetGroupMessages = () => {
  const [error, setError] = useState(null);
  const { 
    selectedGroup, 
    groupMessages, 
    setGroupMessages, 
    setLoadingMessages 
  } = useGroupStore();

  useEffect(() => {
    let isMounted = true;
    
    const getGroupMessages = async () => {
      if (!selectedGroup) return;
      
      setLoadingMessages(true);
      setError(null);
      
      try {
        const res = await fetch(`/api/groups/${selectedGroup._id}/messages`, {
          credentials: "include"
        });
        
        if (!isMounted) return;
        
        const data = await res.json();
        
        if (!res.ok) {
          throw new Error(data.error || "Failed to fetch messages");
        }
        
        setGroupMessages(data);
      } catch (error) {
        console.error("Error fetching group messages:", error);
        setError(error.message);
        toast.error(`Error loading messages: ${error.message}`);
      } finally {
        if (isMounted) {
          setLoadingMessages(false);
        }
      }
    };

    getGroupMessages();
    
    return () => {
      isMounted = false;
    };
  }, [selectedGroup, setGroupMessages, setLoadingMessages]);

  return { groupMessages, error };
};

export default useGetGroupMessages;