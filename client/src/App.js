import './index.css'
import io from 'socket.io-client'
import { useState } from 'react'
import Chat from './Chat'
// import Draggable from 'react-draggable'

// const port = process.env.PORT || 'http://localhost:3001' //trying port

const socket = io.connect()

function App() {
  const [username, setUsername] = useState('')
  const [room, setRoom] = useState('')
  const [showChat, setShowChat] = useState(false)

  function joinRoom() {
    if (username !== '' && room !== '') {
      socket.emit('join_room', room)
      setShowChat(true)
    }
  }

  return (
    // <Draggable>
    <div className="App bg-amber-100 flex flex-col justify-center items-center rounded">
      {!showChat ? (
        <>
          <h3 className="bg-amber-400 text-3xl font-bold">Join a chat</h3>
          <input
            type="text"
            name="name"
            placeholder="Enter your name..."
            onChange={(e) => setUsername(e.target.value)}
            onKeyPress={(e) => {
              e.key === 'Enter' && setUsername(e.target.value)
            }}
          />
          <input
            type="text"
            name="room"
            placeholder="Room ID.."
            onChange={(e) => setRoom(e.target.value)}
            onKeyPress={(e) => {
              e.key === 'Enter' && joinRoom()
            }}
          />
          <button onClick={joinRoom}>Join a room</button>
        </>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
    // </Draggable>
  )
}

export default App
