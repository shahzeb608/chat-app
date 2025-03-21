import { create } from "zustand";

const useGroupStore = create((set, get) => ({
  groups: [],
  selectedGroup: null,
  groupMessages: [],
  loadingGroups: false,
  loadingMessages: false,
  
  setGroups: (groups) => set({ groups }),
  setSelectedGroup: (group) => set({ selectedGroup: group }),
  setGroupMessages: (messages) => set({ groupMessages: messages }),
  
  addGroup: (group) => set((state) => ({
    groups: [group, ...state.groups]
  })),
  
  updateGroup: (updatedGroup) => set((state) => ({
    groups: state.groups.map(group => 
      group._id === updatedGroup._id ? updatedGroup : group
    ),
    selectedGroup: state.selectedGroup?._id === updatedGroup._id 
      ? updatedGroup 
      : state.selectedGroup
  })),
  
  removeGroup: (groupId) => set((state) => ({
    groups: state.groups.filter(group => group._id !== groupId),
    selectedGroup: state.selectedGroup?._id === groupId 
      ? null 
      : state.selectedGroup
  })),
  
  addGroupMessage: (message) => set((state) => ({
    groupMessages: [...state.groupMessages, message]
  })),
  
  setLoadingGroups: (loading) => set({ loadingGroups: loading }),
  setLoadingMessages: (loading) => set({ loadingMessages: loading })
}));

export default useGroupStore;