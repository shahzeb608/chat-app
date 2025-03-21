import { useState } from "react";
import { FaUsers } from "react-icons/fa";
import { HiDotsVertical } from "react-icons/hi";
import GroupInfoModal from "../modals/GroupInfoModal";
import PropTypes from "prop-types";

const GroupInfoHeader = ({ group }) => {
  const [showInfoModal, setShowInfoModal] = useState(false);
  
  if (!group) return null;
  
  return (
    <div className="flex items-center justify-between p-4 border-b border-gray-700">
      <div className="flex items-center space-x-3">
        <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center">
          <FaUsers className="text-white" />
        </div>
        
        <div>
          <h1 className="font-bold text-lg">{group.name}</h1>
          <p className="text-gray-400 text-sm">
            {group.members?.length || 0} members
          </p>
        </div>
      </div>

      <button 
        onClick={() => setShowInfoModal(true)}
        className="p-2 rounded-full hover:bg-gray-800"
        aria-label="Group information"
      >
        <HiDotsVertical />
      </button>
      
      {showInfoModal && (
        <GroupInfoModal group={group} onClose={() => setShowInfoModal(false)} />
      )}
    </div>
  );
};

GroupInfoHeader.propTypes = {
  group: PropTypes.shape({
    name: PropTypes.string.isRequired,
    members: PropTypes.array.isRequired
  }).isRequired
};

export default GroupInfoHeader;