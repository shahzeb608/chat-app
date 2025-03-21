// In useListenMessages.js
import { useEffect } from "react";
import useSocketStore from "../zustand/useSocketStore";
import useConversation from "../zustand/useConversation";

const useListenMessages = () => {
  const { socket } = useSocketStore();
  const { messages, setMessages, selectedConversation } = useConversation();

  useEffect(() => {
    if (!socket) return;
    
    console.log("Setting up new message listener");
    
    const handleNewMessage = (newMessage) => {
      console.log("New message received:", newMessage);
      
      
      if (
        (newMessage.senderId === selectedConversation?._id || 
         newMessage.receiverId === selectedConversation?._id)
      ) {
        console.log("Adding message to conversation");
        newMessage.shouldShake = true;
        setMessages([...messages, newMessage]);
      } else {
        console.log("Message not for current conversation, ignoring");
      }
    };

    socket.on("newMessage", handleNewMessage);

    return () => {
      console.log("Removing new message listener");
      socket.off("newMessage", handleNewMessage);
    };
  }, [socket, setMessages, messages, selectedConversation]);
};

export default useListenMessages;