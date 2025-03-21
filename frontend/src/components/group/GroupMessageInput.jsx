import { useState } from "react";
import useSendGroupMessage from "../../hooks/useSendGroupMessage";
import { BiSend } from "react-icons/bi";

const GroupMessageInput = () => {
  const [message, setMessage] = useState("");
  const { sendGroupMessage, loading } = useSendGroupMessage();
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (message.trim() === "" || loading) return;
    
    await sendGroupMessage(message);
    setMessage("");
  };
  
  return (
    <form onSubmit={handleSubmit} className="p-4 border-t border-gray-800">
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder="Type a message..."
          className="flex-1 bg-gray-800 text-white rounded-full px-4 py-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <button
          type="submit"
          disabled={loading || message.trim() === ""}
          className="bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed text-white rounded-full p-2"
        >
          <BiSend size={20} />
        </button>
      </div>
    </form>
  );
};

export default GroupMessageInput;