import './index.css'
import io from 'socket.io-client'
import { useState } from 'react'
import Chat from './Chat'

const socket = io.connect('http://localhost:3001')

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
    <div className="App flex flex-col justify-center items-center">
      {!showChat ? (
        <>
          <h3 className="bg-amber-400 text-3xl font-bold">Join a chat</h3>
          <input
            type="text"
            placeholder="Enter your name..."
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="text"
            placeholder="Room ID.."
            onChange={(e) => setRoom(e.target.value)}
          />
          <button onClick={joinRoom}>Join a room</button>
        </>
      ) : (
        <Chat socket={socket} username={username} room={room} />
      )}
    </div>
  )
}

export default App
