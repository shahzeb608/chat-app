import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import useAuthStore from "../../zustand/useAuthStore";
import { formatDistanceToNow } from "date-fns";

const GroupMessageItem = ({ message }) => {
  const { authUser } = useAuthStore();
  const [shouldShake, setShouldShake] = useState(message.shouldShake || false);
  
  
  const senderId = typeof message.senderId === 'object' ? message.senderId?._id : message.senderId;
  const isOwnMessage = senderId === authUser?._id;
  const sender = typeof message.senderId === 'object' ? message.senderId : null;

  
  const formattedTime = (() => {
    try {
      if (!message.createdAt) return "just now";
      
      const messageDate = new Date(message.createdAt);
    
      if (isNaN(messageDate.getTime())) return "just now";
      
      return formatDistanceToNow(messageDate, { addSuffix: true });
    } catch (error) {
      console.warn("Error formatting date:", error);
      return "just now";
    }
  })();
  
  
  useEffect(() => {
    if (shouldShake) {
      const timer = setTimeout(() => {
        setShouldShake(false);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [shouldShake]);

  return (
    <div
      className={`flex ${isOwnMessage ? "justify-end" : "justify-start"} ${
        shouldShake ? "animate-shake" : ""
      }`}
    >
      <div
        className={`flex max-w-[75%] ${
          isOwnMessage ? "flex-row-reverse" : "flex-row"
        }`}
      >
        
        {!isOwnMessage && sender && (
          <div className="avatar mr-2">
            <div className="w-8 rounded-full">
              <img 
                src={sender.profilePic} 
                alt={sender.fullName || "User"} 
                onError={(e) => {
                  e.target.src = "/default-avatar.png";
                }}
              />
            </div>
          </div>
        )}

        <div
          className={`rounded-lg px-4 py-2 ${
            isOwnMessage
              ? "bg-blue-600 text-white mr-2"
              : "bg-gray-700 text-gray-100"
          }`}
        >
          
          {!isOwnMessage && sender && (
            <p className="text-sm font-semibold mb-1">{sender.fullName || "Unknown User"}</p>
          )}

        
          <p className="break-words">{message.message}</p>

          
          <p className="text-xs text-right mt-1 opacity-70">
            {formattedTime}
          </p>
        </div>
      </div>
    </div>
  );
};

GroupMessageItem.propTypes = {
  message: PropTypes.shape({
    _id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    senderId: PropTypes.oneOfType([
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        fullName: PropTypes.string,
        profilePic: PropTypes.string,
      }),
      PropTypes.string
    ]).isRequired,
    message: PropTypes.string.isRequired,
    createdAt: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.instanceOf(Date)
    ]),
    shouldShake: PropTypes.bool
  }).isRequired
};

export default GroupMessageItem;