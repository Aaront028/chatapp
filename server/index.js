const express = require('express')
const app = express()
const path = require('path')
const http = require('http')
const cors = require('cors')
const { Server } = require('socket.io')
const port = process.env.PORT || 3000
app.use(cors())
app.use(express.static(path.join(__dirname + '/public')))
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin: 'https://azzsocketchatapp.herokuapp.com',
    // origin: 'http://localhost:3000', //

    method: ['GET', 'POST'],
  },
})

//listening to events on the server in the client side
io.on('connection', (socket) => {
  console.log('User Connected', socket.id)

  socket.on('join_room', (data) => {
    socket.join(data)
    console.log(`User with ID: ${socket.id} joined room: ${data}`)
  })

  socket.on('send_message', (data) => {
    socket.to(data.room).emit('receive_message', data)
  })
  socket.on('disconnect', () => {
    console.log('User Disconnected', socket.id)
  })
})

server.listen(port, () => {
  console.log('listening to port')
})
