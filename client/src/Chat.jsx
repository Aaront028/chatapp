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
    <div className="rounded">
      <p className="text-xl bg-amber-200">Live Chat</p>
      <div className="p-4 rounded">
        <div className="bg-stone-50 flex flex-col rounded">
          {messageList.map((messageContent, index) => {
            return (
              <div
                className={
                  username === messageContent.author
                    ? 'text-xs bg-amber-100 flex justify-end'
                    : 'text-xs bg-amber-100 flex justify-start'
                }
              >
                <p
                  className={
                    username === messageContent.author
                      ? ' bg-green-400 rounded m-px p-1'
                      : ' bg-cyan-400 rounded m-px p-1'
                  }
                  key={index}
                >
                  {messageContent.message}
                </p>
              </div>
            )
          })}
        </div>
      </div>
      <div className="chat-footer"></div>
      <input
        className="pl-2 rounded"
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
