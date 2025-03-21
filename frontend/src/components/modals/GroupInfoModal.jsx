import { useState, useEffect } from "react";
import useAuthStore from "../../zustand/useAuthStore";
import useGroupStore from "../../zustand/useGroupStore";
import { IoClose } from "react-icons/io5";
import { MdExitToApp } from "react-icons/md";
import toast from "react-hot-toast";
import PropTypes from "prop-types";

const GroupInfoModal = ({ group, onClose }) => {
  const { authUser } = useAuthStore();
  const { removeGroup } = useGroupStore();
  const [leaveLoading, setLeaveLoading] = useState(false);
  
  const isAdmin = group?.admin?._id === authUser?._id;
  const adminName = isAdmin ? "You" : group?.admin?.fullName || "Unknown";
  const memberCount = group?.members?.length || 0;
  
  
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);
  
  const handleLeaveGroup = async () => {
    if (!confirm("Are you sure you want to leave this group?")) {
      return;
    }
    
    setLeaveLoading(true);
    try {
      const res = await fetch(`/api/groups/${group._id}/leave`, {
        method: "POST",
        credentials: "include"
      });
      
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to leave group");
      
      toast.success("You've left the group");
      removeGroup(group._id);
      onClose();
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLeaveLoading(false);
    }
  };
  
  if (!group) {
    return null;
  }
  
  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="group-info-title"
    >
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 id="group-info-title" className="text-xl font-bold">Group Information</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <div className="flex flex-col items-center mb-4">
          <div className="avatar mb-2">
            <div className="w-24 rounded-full">
              <img 
                src={group.groupImage || `https://avatar.iran.liara.run/public/group?name=${encodeURIComponent(group.name)}`} 
                alt={group.name}
                onError={(e) => {
                  e.target.src = "/default-group-image.png";
                }}
              />
            </div>
          </div>
          <h3 className="text-xl font-bold">{group.name}</h3>
          {group.description && (
            <p className="text-center text-gray-300 mt-1">{group.description}</p>
          )}
          <p className="text-gray-400 mt-1">
            Created by {adminName}
          </p>
        </div>
        
        <div className="mb-4">
          <h4 className="font-semibold mb-2">Members ({memberCount})</h4>
          <div className="max-h-60 overflow-y-auto rounded bg-gray-700 p-2">
            {group.members?.map((member) => (
              <div key={member._id} className="flex items-center py-2">
                <div className="avatar mr-2">
                  <div className="w-8 rounded-full">
                    <img 
                      src={member.profilePic} 
                      alt={member.fullName || "User"}
                      onError={(e) => {
                        e.target.src = "/default-avatar.png";
                      }}
                    />
                  </div>
                </div>
                <span className="flex-1">
                  {member._id === authUser?._id ? "You" : (member.fullName || "Unknown User")}
                </span>
                {member._id === group.admin?._id && (
                  <span className="text-xs bg-blue-600 px-2 py-1 rounded-full">
                    Admin
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
        
        {!isAdmin && (
          <div className="flex justify-end">
            <button
              onClick={handleLeaveGroup}
              disabled={leaveLoading}
              className="flex items-center gap-1 px-4 py-2 rounded bg-red-600 hover:bg-red-500 disabled:bg-red-800 disabled:cursor-not-allowed"
            >
              <MdExitToApp size={18} />
              {leaveLoading ? "Leaving..." : "Leave Group"}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

GroupInfoModal.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    description: PropTypes.string,
    groupImage: PropTypes.string,
    admin: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string
    }).isRequired,
    members: PropTypes.arrayOf(
      PropTypes.shape({
        _id: PropTypes.string.isRequired,
        fullName: PropTypes.string,
        profilePic: PropTypes.string
      })
    ).isRequired
  }).isRequired,
  onClose: PropTypes.func.isRequired
};

export default GroupInfoModal;