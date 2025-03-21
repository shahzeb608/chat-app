import { useState } from "react";
import useGroupStore from "../zustand/useGroupStore";
import toast from "react-hot-toast";

const useCreateGroup = () => {
  const [loading, setLoading] = useState(false);
  const { addGroup } = useGroupStore();

  const createGroup = async (groupData) => {
    if (!groupData.name || !groupData.name.trim()) {
      toast.error("Group name is required");
      return null;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/groups/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(groupData),
        credentials: "include"
      });
      
      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.error || "Failed to create group");
      }

      toast.success("Group created successfully!");
      addGroup(data);
      return data;
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error(error.message || "Failed to create group");
      return null;
    } finally {
      setLoading(false);
    }
  };

  return { createGroup, loading };
};

export default useCreateGroup;