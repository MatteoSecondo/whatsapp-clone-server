import mongoose from "mongoose"

const chatSchema = mongoose.Schema({
    participants: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'users'
    }],
    messages: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'messages'
    }]
})

export default mongoose.model('chats', chatSchema)