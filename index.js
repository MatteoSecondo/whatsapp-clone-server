import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import { Server } from 'socket.io'
import jwt from 'jsonwebtoken'
import CryptoJS from 'crypto-js'
import validateToken from './middlewares/AuthMiddleware.js'

import Users from './models//Users.js'
import Chats from './models//Chats.js'
import Messages from './models/Messages.js'

//configuration
const app = express()
const port = process.env.PORT || 9000
const connection_url = 'mongodb+srv://webprogramming222:dlDK3clsdD6nIYw7@cluster0.8ap4sfm.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0'

//middlewares
app.use(express.json())
app.use(cors())

const encryptData = (data, key) => {
    return CryptoJS.AES.encrypt(JSON.stringify(data), key).toString();
}

const decryptData = (encryptedData, key) => {
    const bytes  = CryptoJS.AES.decrypt(encryptedData, key);
    return JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
}

//database
const db = mongoose.connection
db.on('open', () => {
    console.log('DB connected')
})

await mongoose.connect(connection_url)

//routes
app.get('/', (req, res) => {
    res.status(200).send('Hello world!')
})

app.post('/users/login', async (req, res) => {
    const data = await Users.findOne({googleId: req.body.googleId})

    if (data) {
        const accesToken = jwt.sign({user: data}, "RXxbKgsy9SqI2S6x1et3")
        res.status(200).send({token: accesToken, user: data})
    }
    else {
        const data = await Users.create({
            googleId: req.body.googleId,
            name: req.body.name,
            email: req.body.email,
            picture: req.body.picture,
        })

        const accesToken = jwt.sign({user: data}, "RXxbKgsy9SqI2S6x1et3");
        res.status(201).send({token: accesToken, user: data})
        }
})

app.get('/users/auth', validateToken, async (req, res) => {
    const data = await Users.findById(req.user.user._id).populate({path: 'chats', populate: [{path: 'participants'}, {path: 'messages', populate: {path: 'sender'}}]})
    res.status(200).send({user: data})
})

app.get('/users/populate', validateToken, async (req, res) => {
    const data = await Users.findById(req.user.user._id).populate({path: 'chats', populate: [{path: 'participants'}, {path: 'messages', populate: {path: 'sender'}}]})
    res.status(200).send({user: data})
})

app.get('/users/:name', async (req, res) => {
    const data = await Users.find({name: req.params.name}, 'name')
    res.status(200).send(data)
})

app.get('/chats/create/:participantId', validateToken, async (req, res) => {
    const data = await Chats.create({participants: [req.params.participantId, req.user.user._id]})
    await data.populate('participants')
    await Users.findByIdAndUpdate(req.params.participantId, {$push: {chats: data._id}})
    await Users.findByIdAndUpdate(req.user.user._id, {$push: {chats: data._id}})
    res.status(200).send(data)
})

//listening
const server = app.listen(port, () => console.log(`Listening on port ${port}`))

const io = new Server(server, {
    cors: {
      origin: "http://localhost:3000"
    }
  })

io.on('connection', (socket) => {
    socket.on('send-message', async (object) => {
        const decryptedData = decryptData(object.message, '3M/IwH6UeOARJ3m3Ap18rg==')
        const data = await Messages.create(decryptedData)
        data.populate('sender')
        await Chats.findByIdAndUpdate(object.chatId, {$push: {messages: data._id}})
        const encryptedData = encryptData(data, '3M/IwH6UeOARJ3m3Ap18rg==')
        io.emit('new-message', encryptedData)
    })
})