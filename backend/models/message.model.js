import mongoose from 'mongoose';

const messageSchema = mongoose.Schema({
    senderId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    receiverId: {  
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isGroupMessage: {
        type: Boolean,
        default: false
      },
      groupId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Group",
      }
},{timestamps: true});

const Message = mongoose.model('Message', messageSchema);
export default Message;