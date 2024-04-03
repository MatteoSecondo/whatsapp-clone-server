import mongoose from "mongoose"

const messageSchema = mongoose.Schema({
    message: String,
    timestamp: String,
    audio: String,
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }
})

export default mongoose.model('messages', messageSchema)