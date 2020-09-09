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
const count = 0

io.on('connection',(socket) => {
    console.log('connected user')
    socket.emit('countUpdated',count)

})


server.listen(port,() => {
    console.log('server connected in port '+ port)
})