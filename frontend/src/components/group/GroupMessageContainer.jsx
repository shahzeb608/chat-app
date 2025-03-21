import { useEffect, useRef } from "react";
import useGroupStore from "../../zustand/useGroupStore";
import useGetGroupMessages from "../../hooks/useGetGroupMessages";
import useListenGroupMessages from "../../hooks/useListenGroupMessages";
import MessageSkeleton from "../skeletons/MessageSkeleton";
import GroupMessageInput from "./GroupMessageInput";
import GroupMessageItem from "./GroupMessageItem";
import GroupInfoHeader from "./GroupInfoHeader";

const GroupMessageContainer = () => {
  const { selectedGroup, loadingMessages } = useGroupStore();
  const { groupMessages } = useGetGroupMessages();
  const messagesEndRef = useRef(null);
  
  
  useListenGroupMessages();
  
  
  useEffect(() => {
    if (groupMessages?.length) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [groupMessages]);
  
  if (!selectedGroup) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center">
        <h1 className="text-2xl font-bold mb-2">Welcome to Group Chat</h1>
        <p className="text-gray-400">
          Select a group from the sidebar or create a new one to start chatting
        </p>
      </div>
    );
  }
  
  return (
    <div className="flex-1 flex flex-col">
      <GroupInfoHeader group={selectedGroup} />
      
      <div className="flex-1 overflow-y-auto p-4">
        {loadingMessages ? (
          <div className="space-y-4">
            <MessageSkeleton />
            <MessageSkeleton />
            <MessageSkeleton />
          </div>
        ) : groupMessages?.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full">
            <h2 className="text-xl font-bold mb-2">No messages yet</h2>
            <p className="text-gray-400">Be the first to send a message!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {groupMessages.map((message) => (
              <GroupMessageItem key={message._id} message={message} />
            ))}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      <GroupMessageInput />
    </div>
  );
};

export default GroupMessageContainer;