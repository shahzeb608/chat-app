import MessageContainer from "../../components/messages/MessageContainer";
import GroupMessageContainer from "../../components/group/GroupMessageContainer";
import Sidebar from "../../components/sidebar/Sidebar";
import useGroupStore from "../../zustand/useGroupStore";
import useConversation from "../../zustand/useConversation";  

const Home = () => {
  const { selectedGroup } = useGroupStore();
  const { selectedConversation } = useConversation();  
  
  return (
    <div className="flex h-screen">
      <Sidebar />
      
      {selectedGroup ? (
        <GroupMessageContainer />
      ) : (
        <MessageContainer />
      )}
    </div>
  );
};

export default Home;