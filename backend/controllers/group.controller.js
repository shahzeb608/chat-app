import mongoose from "mongoose";
import Group from "../models/group.model.js";
import User from "../models/user.model.js";
import Message from "../models/message.model.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const createGroup = async (req, res) => {
  try {
    const { name, description, members } = req.body;
    const adminId = req.user._id;

    const memberIds = members.map(id => new mongoose.Types.ObjectId(id));
    // Add admin to members if not already included
    if (!memberIds.some(id => id.equals(adminId))) {
      memberIds.push(new mongoose.Types.ObjectId(adminId));
    }

    const newGroup = new Group({
      name,
      description,
      admin: adminId,
      members: memberIds,
      groupImage: `https://avatar.iran.liara.run/public/group?name=${encodeURIComponent(name)}`,
    });

    await newGroup.save();

    // Populate members data for response
    const populatedGroup = await Group.findById(newGroup._id)
      .populate("members", "username fullName profilePic gender")
      .populate("admin", "username fullName profilePic gender");

    // Notify all members about the new group
    memberIds.forEach(memberId => {
      const receiverSocketId = getReceiverSocketId(memberId.toString());
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newGroup", populatedGroup);
      }
    });

    res.status(201).json(populatedGroup);
  } catch (error) {
    console.error("Error in createGroup:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getGroups = async (req, res) => {
  try {
    const userId = req.user._id;

    const groups = await Group.find({ members: userId })
      .populate("members", "username fullName profilePic gender")
      .populate("admin", "username fullName profilePic gender")
      .sort({ updatedAt: -1 });

    res.status(200).json(groups);
  } catch (error) {
    console.error("Error in getGroups:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getGroupById = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id)
      .populate("members", "username fullName profilePic gender")
      .populate("admin", "username fullName profilePic gender");

    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member of the group
    if (!group.members.some(member => member._id.equals(userId))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    res.status(200).json(group);
  } catch (error) {
    console.error("Error in getGroupById:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const addMemberToGroup = async (req, res) => {
  try {
    const { id } = req.params;
    const { memberId } = req.body;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin
    if (!group.admin.equals(userId)) {
      return res.status(403).json({ message: "Only admin can add members" });
    }

    // Check if user is already a member
    if (group.members.includes(memberId)) {
      return res.status(400).json({ message: "User already a member of this group" });
    }

    // Add member
    group.members.push(memberId);
    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("members", "username fullName profilePic gender")
      .populate("admin", "username fullName profilePic gender");

    // Notify new member
    const receiverSocketId = getReceiverSocketId(memberId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("addedToGroup", updatedGroup);
    }

    // Notify all members about the update
    updatedGroup.members.forEach(member => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("groupUpdated", updatedGroup);
      }
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in addMemberToGroup:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const removeMemberFromGroup = async (req, res) => {
  try {
    const { id, memberId } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is admin or removing themselves
    if (!group.admin.equals(userId) && !userId.equals(memberId)) {
      return res.status(403).json({ message: "Not authorized" });
    }

    // Admin cannot be removed
    if (group.admin.equals(memberId)) {
      return res.status(400).json({ message: "Cannot remove group admin" });
    }

    // Remove member
    group.members = group.members.filter(member => !member.equals(memberId));
    await group.save();

    const updatedGroup = await Group.findById(id)
      .populate("members", "username fullName profilePic gender")
      .populate("admin", "username fullName profilePic gender");

    // Notify removed member
    const removedMemberSocketId = getReceiverSocketId(memberId);
    if (removedMemberSocketId) {
      io.to(removedMemberSocketId).emit("removedFromGroup", { groupId: id });
    }

    // Notify all remaining members about the update
    updatedGroup.members.forEach(member => {
      const memberSocketId = getReceiverSocketId(member._id.toString());
      if (memberSocketId) {
        io.to(memberSocketId).emit("groupUpdated", updatedGroup);
      }
    });

    res.status(200).json(updatedGroup);
  } catch (error) {
    console.error("Error in removeMemberFromGroup:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const sendGroupMessage = async (req, res) => {
  try {
    const { id } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    console.log(`Sending group message to ${id} from ${senderId}: "${message}"`);

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member of the group
    if (!group.members.some(member => member.equals(senderId))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    const newMessage = new Message({
        senderId,
        receiverId: id, 
        message,
        isGroupMessage: true,
        groupId: id,
      });

    await newMessage.save();

    // Add message to group
    group.messages.push(newMessage._id);
    await group.save();

    // Populate sender info for the response
    const populatedMessage = await Message.findById(newMessage._id).populate("senderId", "username fullName profilePic");

    // Notify all group members
    group.members.forEach(memberId => {
      if (!memberId.equals(senderId)) { // Don't send to the sender
        const receiverSocketId = getReceiverSocketId(memberId.toString());
        if (receiverSocketId) {
          io.to(receiverSocketId).emit("newGroupMessage", {
            message: populatedMessage,
            groupId: id
          });
        }
      }
    });

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error("Error in sendGroupMessage:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const getGroupMessages = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user._id;

    const group = await Group.findById(id);
    if (!group) {
      return res.status(404).json({ message: "Group not found" });
    }

    // Check if user is a member of the group
    if (!group.members.some(member => member.equals(userId))) {
      return res.status(403).json({ message: "You are not a member of this group" });
    }

    // Populate messages for the group
    const populatedGroup = await Group.findById(id).populate({
      path: "messages",
      populate: {
        path: "senderId",
        select: "username fullName profilePic"
      }
    });

    res.status(200).json(populatedGroup.messages);
  } catch (error) {
    console.error("Error in getGroupMessages:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};