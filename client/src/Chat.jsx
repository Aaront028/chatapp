import React, { useState, useEffect } from 'react'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])

  const sendMessage = async (e) => {
    if (currentMessage !== '') {
      e.preventDefault()
      const messageData = {
        room: room,
        author: username,
        message: currentMessage,
        time:
          new Date(Date.now()).getHours() +
          ':' +
          new Date(Date.now()).getMinutes(),
      }

      await socket.emit('send_message', messageData)
      setMessageList((list) => [...list, messageData])
    }
  }

  useEffect(() => {
    socket.off('receive_message')
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data])
      // setMessageList(data)
    })
  }, [socket])

  return (
    <div>
      <p className="text-xl bg-amber-400">Live Chat</p>
      <div>
        <div className="bg-stone-50 flex flex-col ">
          {messageList.map((messageContent, index) => {
            return (
              <p
                className={
                  username === messageContent.author
                    ? 'text-xs bg-amber-100 flex justify-end'
                    : 'text-xs bg-amber-100 flex justify-start'
                }
                key={index}
              >
                {messageContent.message}
              </p>
            )
          })}
        </div>
      </div>
      <div className="chat-footer"></div>
      <input
        type="text"
        placeholder="Hey..."
        onChange={(e) => {
          setCurrentMessage(e.target.value)
        }}
        onKeyPress={(e) => {
          e.key === 'Enter' && sendMessage(e)
        }}
      />
      <button onClick={sendMessage}>&#9658;</button>
    </div>
  )
}

export default Chat
