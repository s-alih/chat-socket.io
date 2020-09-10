const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')
const Filter = require('bad-words')
const { generateMessage , generateLocationMessage} = require('./utils/message')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname,'../public')

app.use(express.static(publicPath))
// let count = 0

io.on('connection',(socket) => {
    console.log('connected user')
    socket.emit('msg', generateMessage('Welcome!'))
    socket.broadcast.emit('msg',generateMessage('A new user joined'))

    socket.on('message',(message,callback) => {
        const filter = new Filter()
        if(filter.isProfane(message)){
            return callback('Bad word macha')
        }
        io.emit('msg',generateMessage(message))
        callback()
    })
    socket.on('sendLocation',( {
        latitude,
        longitude
    },callback) => {
        io.emit('locationMessage',generateLocationMessage(`https://google.com/maps?q=${latitude},${longitude}`))
        callback('Location shared succesfully')
    })

    socket.on('disconnect',() => {
        io.emit('msg',generateMessage('A new user disconnected'))
    })
})


server.listen(port,() => {
    console.log('server connected in port '+ port)
})