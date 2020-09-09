const path = require('path')
const http = require('http')
const express = require('express')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app)
const io = socketio(server)

const port = process.env.PORT || 3000

const publicPath = path.join(__dirname,'../public')

app.use(express.static(publicPath))
// let count = 0

io.on('connection',(socket) => {
    console.log('connected user')
    socket.emit('msg', 'Welcome!')
    socket.broadcast.emit('msg','A new user joind')

    socket.on('message',(message,callback) => {
        io.emit('msg',message)
        callback('deliverd macha')
    })
    socket.on('sendLocation',( {
        latitude,
        longitude
    }) => {
        io.emit('msg',`https://google.com/maps?q=${latitude},${longitude}`)
    })

    socket.on('disconnect',() => {
        io.emit('msg','disconnected new user')
    })
})


server.listen(port,() => {
    console.log('server connected in port '+ port)
})