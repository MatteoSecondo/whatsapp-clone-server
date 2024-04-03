import mongoose from "mongoose"

const userSchema = mongoose.Schema({
    googleId: String,
    name: String,
    email: String,
    picture: String,
    chats: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'chats'
    }]
})

export default mongoose.model('users', userSchema)