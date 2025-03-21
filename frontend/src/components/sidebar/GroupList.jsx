import { useState } from "react";
import useGetGroups from "../../hooks/useGetGroups";
import useGroupStore from "../../zustand/useGroupStore";
import GroupItem from "./GroupItem";
import { MdGroupAdd } from "react-icons/md";
import CreateGroupModal from "../modals/CreateGroupModal";

const GroupList = () => {
  const { groups } = useGetGroups();
  const { loadingGroups } = useGroupStore();
  const [showCreateModal, setShowCreateModal] = useState(false);

  return (
    <div className="py-2 flex flex-col h-full">
      <div className="flex items-center justify-between px-4 mb-2">
        <h2 className="text-xl font-bold text-gray-200">Groups</h2>
        <button 
          onClick={() => setShowCreateModal(true)}
          className="p-1 rounded-full hover:bg-gray-700"
          aria-label="Create new group"
        >
          <MdGroupAdd size={24} />
        </button>
      </div>
      
      {loadingGroups ? (
        <div className="flex justify-center p-4">
          <div className="loading loading-spinner"></div>
        </div>
      ) : (
        <div className="flex-1 overflow-auto">
          {groups?.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full py-8">
              <p className="text-center text-gray-400">No groups yet</p>
              <button
                onClick={() => setShowCreateModal(true)}
                className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-500 rounded-md"
              >
                Create your first group
              </button>
            </div>
          ) : (
            groups.map((group) => (
              <GroupItem key={group._id} group={group} />
            ))
          )}
        </div>
      )}
      
      {showCreateModal && (
        <CreateGroupModal onClose={() => setShowCreateModal(false)} />
      )}
    </div>
  );
};

export default GroupList;