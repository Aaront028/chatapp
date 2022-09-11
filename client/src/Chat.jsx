import React, { useState, useEffect, useRef } from 'react'
// import Draggable from 'dra'
import ScrollToBottom from 'react-scroll-to-bottom'

function Chat({ socket, username, room }) {
  const [currentMessage, setCurrentMessage] = useState('')
  const [messageList, setMessageList] = useState([])
  const [isVideoOn, setVideOn] = useState(false)
  const [stream, setStream] = useState()
  const myVideo = useRef()
  // const userVideo = useRef()
  // const connectionRef = useRef()

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
      setCurrentMessage('')
    }
  }

  function onVideo() {
    setVideOn(true)
  }

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setStream(stream)
        myVideo.current.srcObject = stream
      })

    socket.off('receive_message')
    socket.on('receive_message', (data) => {
      setMessageList((list) => [...list, data])
      // setMessageList(data)
    })
  }, [socket])

  return (
    <div className="rounded">
      <p className="text-xl bg-amber-200 rounded pl-2">
        Live Chat Room: Hey <span className="red">{username}</span> You are in
        room {room}
      </p>
      <div className="p-4 rounded">
        <div className="bg-stone-50 flex flex-col rounded">
          <ScrollToBottom className="scroll bg-amber-100">
            {messageList.map((messageContent, index) => {
              return (
                <div
                  className={
                    username === messageContent.author
                      ? 'text-xs bg-amber-100 flex flex-row justify-end'
                      : 'text-xs bg-amber-100 flex  justify-start'
                  }
                  key={index}
                >
                  <p
                    className={
                      username === messageContent.author
                        ? 'm-px p-1'
                        : 'm-px p-1 '
                    }
                    key={index}
                    style={{ fontSize: '8px', color: 'grey' }}
                  >
                    {messageContent.author}
                  </p>

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

                  <p
                    className={
                      username === messageContent.author
                        ? '   m-px p-1'
                        : '  m-px p-1'
                    }
                    key={index}
                    style={{ fontSize: '5px', color: 'grey' }}
                  >
                    {messageContent.time}
                  </p>
                </div>
              )
            })}
          </ScrollToBottom>
        </div>
      </div>
      <div className="chat-footer">
        {/* <button onClick={onVideo}>switch on video</button> */}
        {isVideoOn ? (
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{ width: '300px' }}
          />
        ) : null}
      </div>
      <input
        className="pl-2 rounded"
        type="text"
        placeholder="Hey..."
        value={currentMessage}
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
