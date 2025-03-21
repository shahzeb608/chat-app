import mongoose from "mongoose";
import Conversation from "../models/conversation.model.js";
import Message from "../models/message.model.js";
import User from "../models/user.model.js"; 
import { getReceiverSocketId, io } from "../socket/socket.js";


export const sendMessage = async (req, res) => {
  try {
    const { id: receiverId } = req.params;
    const { message } = req.body;
    const senderId = req.user._id;

    console.log(`Sending message from ${senderId} to ${receiverId}: "${message}"`);
    
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);
    const senderObjectId = new mongoose.Types.ObjectId(senderId);

    let conversation = await Conversation.findOne({
      participants: { $all: [receiverObjectId, senderObjectId] },
    });

    if (!conversation) {
      console.log("Creating new conversation");
      conversation = await Conversation.create({
        participants: [receiverObjectId, senderObjectId], 
        messages: [],
      });
    }

    
    const newMessage = new Message({
      senderId,
      receiverId,
      message,
      isGroupMessage: false  
    });

    await newMessage.save();
    
    conversation.messages.push(newMessage._id);
    await conversation.save();

    const receiver = await User.findById(receiverObjectId);
    if (!receiver) {
      console.log("Receiver not found");
      return res.status(400).json({ message: "Receiver not found" });
    }
    
    const receiverSocketId = getReceiverSocketId(receiverId);
    console.log(`Receiver socket ID: ${receiverSocketId}`);
    
    if (receiverSocketId) {
      console.log(`Emitting new message event to socket ${receiverSocketId}`);
      io.to(receiverSocketId).emit("newMessage", newMessage);
    } else {
      console.log("Receiver is not online, message will be delivered when they connect");
    }

    res.status(201).json(newMessage);
  } catch (error) {
    console.error("Error in sendMessage:", error);
    res.status(500).json({ message: "Something went wrong" });
  }
};

  export const getMessage = async (req, res) => {
    try {
      const { id: userToChatId } = req.params;
      const senderId = req.user._id;
  
      
      const userToChatObjectId = new mongoose.Types.ObjectId(userToChatId);
      const senderObjectId = new mongoose.Types.ObjectId(senderId);
  
      const conversation = await Conversation.findOne({
        participants: { $all: [userToChatObjectId, senderObjectId] },
      }).populate({
        path: 'messages',
        model: 'Message'
      });
  
      if (!conversation) {
        return res.status(200).json([]); 
      }
  
      const messages = conversation.messages;
      res.status(200).json(messages);
  
    } catch (error) {
      console.error("Error in getmessages:", error);
      res.status(500).json({ message: "Something went wrong" });
    }
  }