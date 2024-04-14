import mongoose from "mongoose"

const messageSchema = mongoose.Schema({
    text: String,
    timestamp: String,
    audio: String,
    isRead: Boolean,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

export default mongoose.model('messages', messageSchema)