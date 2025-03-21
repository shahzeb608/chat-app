import { useState } from "react";
import useGroupStore from "../zustand/useGroupStore";
import toast from "react-hot-toast";

const useSendGroupMessage = () => {
  const [loading, setLoading] = useState(false);
  const { selectedGroup, groupMessages, setGroupMessages } = useGroupStore();

  const sendGroupMessage = async (message) => {
    if (!selectedGroup) return;
    
    setLoading(true);
    try {
      const res = await fetch(`/api/groups/${selectedGroup._id}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ message }),
        credentials: "include"
      });
      
      const data = await res.json();
      if (data.error) throw new Error(data.error);

      setGroupMessages([...groupMessages, data]);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return { sendGroupMessage, loading };
};

export default useSendGroupMessage;