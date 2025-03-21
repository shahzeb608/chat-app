import { useState, useRef } from "react";
import { BsSend } from "react-icons/bs";
import useSendMessage from "../../hooks/useSendMessage";
import useSocketStore from "../../zustand/useSocketStore";
import useConversation from "../../zustand/useConversation";
import useAuthStore from "../../zustand/useAuthStore";

const MessageInput = () => {
  const [message, setMessage] = useState("");
  const { loading, sendMessage } = useSendMessage();
  const { socket } = useSocketStore();
  const { selectedConversation } = useConversation();
  const { authUser } = useAuthStore();
  const typingTimeoutRef = useRef(null);

  
const handleInputChange = (e) => {
	setMessage(e.target.value);
  
	
	if (socket && selectedConversation) {
	  const typingData = {
		conversationId: selectedConversation._id,
		senderId: authUser._id,
		receiverId: selectedConversation._id, 
	  };
	  
	  console.log("Emitting typing event:", typingData);
	  socket.emit("typing", typingData);
  
	  
	  if (typingTimeoutRef.current) {
		clearTimeout(typingTimeoutRef.current);
	  }
	  
	  
	  typingTimeoutRef.current = setTimeout(() => {
		console.log("Emitting stop typing event");
		socket.emit("stopTyping", typingData);
	  }, 2000);
	}
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!message) return;
    await sendMessage(message);
    setMessage("");

    // Stop typing when message is sent
    if (socket && selectedConversation?._id) {
      socket.emit("stopTyping", {
        conversationId: selectedConversation._id,
        senderId: authUser._id,
      });
    }
  };

  return (
    <form className="px-4 my-3" onSubmit={handleSubmit}>
      <div className="w-full relative">
        <input
          type="text"
          className="border text-sm rounded-lg block w-full p-2.5 bg-gray-700 border-gray-600 text-white"
          placeholder="Send a message"
          value={message}
          onChange={handleInputChange}
        />
        <button type="submit" className="absolute inset-y-0 end-0 flex items-center pe-3">
          {loading ? <div className="loading loading-spinner"></div> : <BsSend />}
        </button>
      </div>
    </form>
  );
};

export default MessageInput;
