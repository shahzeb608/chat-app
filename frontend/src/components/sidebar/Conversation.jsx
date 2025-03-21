import useConversation from "../../zustand/useConversation";
import useSocketStore from "../../zustand/useSocketStore";
import useAuthStore from "../../zustand/useAuthStore";

const Conversation = ({ conversation, lastIdx, emoji }) => {
  const { selectedConversation, setSelectedConversation } = useConversation();
  const { authUser } = useAuthStore();
  const { onlineUsers } = useSocketStore();
  
  const isSelected = selectedConversation?._id === conversation._id;
  const isOnline = onlineUsers.includes(conversation._id);
  
  const defaultProfilePic = `https://avatar.iran.liara.run/public/${conversation.gender === "male" ? "boy" : "girl"}?username=${conversation.username}`;
  const profilePic = conversation.profilePic || defaultProfilePic;
  
  return (
    <>
      <div
        className={`flex gap-2 items-center hover:bg-sky-500 rounded p-2 py-1 cursor-pointer
          ${isSelected ? "bg-sky-500" : ""}
        `}
        onClick={() => setSelectedConversation(conversation)}
      >
        <div className={`avatar ${isOnline ? "online" : ""}`}>
          <div className="w-12 rounded-full">
            <img src={profilePic} alt="user avatar" />
          </div>
        </div>
        
        <div className="flex flex-col flex-1">
          <div className="flex gap-3 justify-between">
            <p className="font-bold text-gray-200">{conversation.fullName}</p>
            <span className="text-xl">{emoji}</span>
          </div>
        </div>
      </div>
      
      {!lastIdx && <div className="divider my-0 py-0 h-1" />}
    </>
  );
};

export default Conversation;