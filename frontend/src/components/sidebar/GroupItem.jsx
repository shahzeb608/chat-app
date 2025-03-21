import { memo } from "react";
import useGroupStore from "../../zustand/useGroupStore";
import useAuthStore from "../../zustand/useAuthStore";
import PropTypes from "prop-types";

const GroupItem = ({ group }) => {
  const { selectedGroup, setSelectedGroup } = useGroupStore();
  const { authUser } = useAuthStore();
  
  if (!group || !authUser) return null;
  
  const isSelected = selectedGroup?._id === group._id;
  
  const handleSelectGroup = () => {
    setSelectedGroup(group);
  };
  
  const isAdmin = group.admin?._id === authUser._id;
  const adminName = isAdmin ? "You" : (group.admin?.fullName || "Unknown");
  
  const memberCount = group.members?.length || 0;
  
  return (
    <div 
      className={`flex items-center gap-2 p-2 py-3 cursor-pointer rounded-md hover:bg-gray-700 ${
        isSelected ? "bg-gray-700" : ""
      }`}
      onClick={handleSelectGroup}
      role="button"
      aria-pressed={isSelected}
    >
      <div className="avatar">
        <div className="w-12 rounded-full">
          <img 
            src={group.groupImage || `https://avatar.iran.liara.run/public/group?name=${encodeURIComponent(group.name)}`} 
            alt={group.name} 
            onError={(e) => {
              e.target.src = "/default-group-image.png";
            }}
          />
        </div>
      </div>
      
      <div className="flex-1 min-w-0">
        <h3 className="text-lg font-semibold truncate">{group.name}</h3>
        <p className="text-sm text-gray-300 truncate">
          {isAdmin ? "Created by you" : `Created by ${adminName}`} • {memberCount} {memberCount === 1 ? "member" : "members"}
        </p>
      </div>
    </div>
  );
};

GroupItem.propTypes = {
  group: PropTypes.shape({
    _id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    groupImage: PropTypes.string,
    admin: PropTypes.shape({
      _id: PropTypes.string.isRequired,
      fullName: PropTypes.string
    }),
    members: PropTypes.array
  }).isRequired
};


export default memo(GroupItem);