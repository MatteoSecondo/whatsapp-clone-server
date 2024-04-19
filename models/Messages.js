import mongoose from "mongoose"

const messageSchema = mongoose.Schema({
    text: String,
    timestamp: Date,
    audio: String,
    isRead: Boolean,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    },
    chat : {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    }
})

export default mongoose.model('messages', messageSchema)