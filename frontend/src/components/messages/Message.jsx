import useConversation from "../../zustand/useConversation";
import { extractTime } from "../../utils/extractTime";
import useAuthStore from "../../zustand/useAuthStore";

const Message = ({ message }) => {
  const { authUser } = useAuthStore();
  const { selectedConversation } = useConversation();
  
  const fromMe = message.senderId === authUser._id;
  const formattedTime = extractTime(message.createdAt);
  const chatClassName = fromMe ? "chat-end" : "chat-start";
  
  const defaultProfilePic = (user) => 
    `https://avatar.iran.liara.run/public/${user.gender === "male" ? "boy" : "girl"}?username=${user.username}`;
    
  const profilePic = fromMe 
    ? (authUser.profilePic || defaultProfilePic(authUser))
    : (selectedConversation?.profilePic || defaultProfilePic(selectedConversation));
  
  const bubbleBgColor = fromMe ? "bg-blue-500" : "";
  
  return (
    <div className={`chat ${chatClassName}`}>
      <div className="chat-image avatar">
        <div className="w-10 rounded-full">
          <img alt="User avatar" src={profilePic} />
        </div>
      </div>
      <div className={`chat-bubble text-white ${bubbleBgColor} pb-2`}>{message.message}</div>
      <div className="chat-footer opacity-50 text-xs flex gap-1 items-center">{formattedTime}</div>
    </div>
  );
};

export default Message;