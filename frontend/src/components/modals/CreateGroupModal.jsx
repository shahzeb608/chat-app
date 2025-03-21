import { useState, useEffect } from "react";
import useCreateGroup from "../../hooks/useCreateGroup";
import useGetUsers from "../../hooks/useGetUsers";
import useAuthStore from "../../zustand/useAuthStore";
import { IoClose } from "react-icons/io5";

const CreateGroupModal = ({ onClose }) => {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const { createGroup, loading } = useCreateGroup();
  const { users, loading: loadingUsers } = useGetUsers();
  const { authUser } = useAuthStore();

  // Filter out the current user from the users list
  const filteredUsers = users?.filter(user => user._id !== authUser?._id) || [];

  const handleToggleUser = (userId) => {
    setSelectedUsers(prev => {
      if (prev.includes(userId)) {
        return prev.filter(id => id !== userId);
      } else {
        return [...prev, userId];
      }
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (name.trim() === "") {
      return;
    }
    
    const groupData = {
      name: name.trim(),
      description: description.trim(),
      members: selectedUsers
    };
    
    const result = await createGroup(groupData);
    if (result) {
      onClose();
    }
  };

  // Close modal when Escape key is pressed
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === "Escape") {
        onClose();
      }
    };
    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [onClose]);

  return (
    <div 
      className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div className="bg-gray-800 rounded-lg max-w-md w-full p-4">
        <div className="flex justify-between items-center mb-4">
          <h2 id="modal-title" className="text-xl font-bold">Create New Group</h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-white"
            aria-label="Close modal"
          >
            <IoClose size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="group-name" className="block mb-1 text-sm font-medium">Group Name</label>
            <input
              id="group-name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter group name"
              required
            />
          </div>
          
          <div className="mb-4">
            <label htmlFor="group-description" className="block mb-1 text-sm font-medium">Description (optional)</label>
            <textarea
              id="group-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 rounded bg-gray-700 text-white"
              placeholder="Enter group description"
              rows="2"
            />
          </div>
          
          <div className="mb-4">
            <label className="block mb-1 text-sm font-medium">Add Members</label>
            <div className="max-h-60 overflow-y-auto border border-gray-700 rounded p-2">
              {loadingUsers ? (
                <div className="flex justify-center p-4">
                  <div className="loading loading-spinner"></div>
                </div>
              ) : filteredUsers.length === 0 ? (
                <p className="text-gray-400 text-center py-2">No users available</p>
              ) : (
                filteredUsers.map((user) => (
                  <div key={user._id} className="flex items-center py-2">
                    <input
                      type="checkbox"
                      id={`user-${user._id}`}
                      checked={selectedUsers.includes(user._id)}
                      onChange={() => handleToggleUser(user._id)}
                      className="mr-2"
                    />
                    <label htmlFor={`user-${user._id}`} className="flex items-center cursor-pointer">
                      <div className="avatar mr-2">
                        <div className="w-8 rounded-full">
                          <img 
                            src={user.profilePic} 
                            alt={user.fullName}
                            onError={(e) => {
                              e.target.src = "/default-avatar.png";
                            }}
                          />
                        </div>
                      </div>
                      <span>{user.fullName}</span>
                    </label>
                  </div>
                ))
              )}
            </div>
          </div>
          
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-700 hover:bg-gray-600"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-500 disabled:bg-blue-800 disabled:cursor-not-allowed"
              disabled={loading || name.trim() === ""}
            >
              {loading ? "Creating..." : "Create Group"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroupModal;