const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage , generateLocationMessage} = require('./utils/message')
const { addUser ,removeUser , getUser ,getUsersInRoom } = require('./utils/users')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname,'../public')

app.use(express.static(publicPath))
// let count = 0

io.on('connection',(socket) => {
    console.log('connected user')

    socket.on('join', (options,callback) => {
        const { error , user } = addUser({
            id: socket.id,
            ...options
        })

        if(error){
            return callback(error)
        }

        socket.join(user.room)

        socket.emit('msg', generateMessage('Admin','Welcome!'))
        socket.broadcast.to(user.room).emit('msg',generateMessage('Admin',`${user.username} has joined`))
        io.to(user.room).emit('roomData',{
            room:user.room,
            users:getUsersInRoom(user.room)
        })
    })

    

    socket.on('message',(message,callback) => {
        const user = getUser(socket.id)
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Bad word macha')
        }
        io.to(user.room).emit('msg',generateMessage(user.username,message))
        callback()
    })
    socket.on('sendLocation',( {
        latitude,
        longitude
    },callback) => {
        const user = getUser(socket.id)

        io.to(user.room).emit('locationMessage',generateLocationMessage(user.username,`https://google.com/maps?q=${latitude},${longitude}`))
        callback('Location shared succesfully')
    })

    socket.on('disconnect',() => {
        const user = removeUser(socket.id)
        if(user){
            io.to(user.room).emit('msg',generateMessage('Admin',`${user.username} is disconnected`))
            io.to(user.room).emit('roomData',{
                room:user.room,
                users:getUsersInRoom(user.room)
            })
        }
        
    })
})


server.listen(port,() => {
    console.log('server connected in port '+ port)
})