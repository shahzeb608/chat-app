import { useEffect } from "react";
import useSocketStore from "../zustand/useSocketStore";
import useGroupStore from "../zustand/useGroupStore";
import useAuthStore from "../zustand/useAuthStore";

const useListenGroupMessages = () => {
  const { socket } = useSocketStore();
  const { authUser } = useAuthStore();
  const { 
    groups, 
    selectedGroup, 
    groupMessages, 
    setGroupMessages,
    addGroup,
    updateGroup,
    removeGroup,
    addGroupMessage
  } = useGroupStore();

  useEffect(() => {
    if (!socket || !authUser) return;
    
    console.log("Setting up group message listeners");
    
    const handleNewGroupMessage = (data) => {
      console.log("New group message received:", data);
      
      if (selectedGroup && data.groupId === selectedGroup._id) {
        const newMessage = {
          ...data.message,
          shouldShake: true,
        };
        setGroupMessages([...groupMessages, newMessage]);
      }
    };
    
    const handleNewGroup = (group) => {
      console.log("Added to new group:", group);
      addGroup(group);
    };
    
    const handleGroupUpdated = (updatedGroup) => {
      console.log("Group updated:", updatedGroup);
      updateGroup(updatedGroup);
    };
    
    const handleRemovedFromGroup = (data) => {
      console.log("Removed from group:", data.groupId);
      removeGroup(data.groupId);
    };
    
    socket.on("newGroupMessage", handleNewGroupMessage);
    socket.on("newGroup", handleNewGroup);
    socket.on("groupUpdated", handleGroupUpdated);
    socket.on("removedFromGroup", handleRemovedFromGroup);
    
    return () => {
      socket.off("newGroupMessage", handleNewGroupMessage);
      socket.off("newGroup", handleNewGroup);
      socket.off("groupUpdated", handleGroupUpdated);
      socket.off("removedFromGroup", handleRemovedFromGroup);
    };
  }, [
    socket, 
    authUser, 
    selectedGroup, 
    groupMessages, 
    setGroupMessages,
    addGroup,
    updateGroup,
    removeGroup
  ]);
};

export default useListenGroupMessages;