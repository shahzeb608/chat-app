// In TypingIndicator.jsx
import { useState, useEffect } from "react";
import useSocketStore from "../../zustand/useSocketStore";
import useConversation from "../../zustand/useConversation";

const TypingIndicator = () => {
  const { socket } = useSocketStore();
  const { selectedConversation } = useConversation();
  const [isTyping, setIsTyping] = useState(false);

  useEffect(() => {
    if (!socket) return;
    
    console.log("Setting up typing event listeners for:", selectedConversation?._id);

    const handleTyping = (data) => {
      console.log("Received typing event:", data);
      
      if (data.senderId === selectedConversation?._id) {
        console.log("Setting typing indicator to true");
        setIsTyping(true);
      }
    };

    const handleStopTyping = (data) => {
      console.log("Received stop typing event:", data);
      if (data.senderId === selectedConversation?._id) {
        console.log("Setting typing indicator to false");
        setIsTyping(false);
      }
    };

    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedConversation]);

  if (!isTyping) return null;

  return (
    <div className="typing-indicator p-2 text-gray-300 flex items-center">
      <span>{selectedConversation?.fullName} is typing</span>
      <div className="ml-2">
        <span className="typing-dots"></span>
      </div>
    </div>
  );
};

export default TypingIndicator;