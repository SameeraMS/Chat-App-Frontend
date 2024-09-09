import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';


export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:3002');

        socketRef.current.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.message}`]);
        });

        socketRef.current.on('user-joined', (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        socketRef.current.on('user-left', (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
        });

        socketRef.current.on('connect', () => {
            socketRef.current.emit('user-joined', { user: socketRef.current.id });
            setMessages((prevMessages) => [...prevMessages, 'You have joined the chat']);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const sendMessage = () => {
        if (message.trim()) {
            setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
            socketRef.current.emit('newMessage', { message, username: socketRef.current.id });
            setMessage('');
        }
    };

    return (
        <div id="chat-container">
            <style jsx>{`
                #chat-container {
                    width: 600px;
                    margin: 50px auto;
                    background-color: white;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                    display: flex;
                    flex-direction: column;
                }

                #chat {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                    border-bottom: 1px solid #ddd;
                }

                .message {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    max-width: 70%;
                    clear: both;
                }

                .message-left {
                    background-color: #e1f0ff;
                    float: left;
                }

                .message-right {
                    background-color: #d1faff;
                    float: right;
                }

                #message-box {
                    padding: 10px;
                    display: flex;
                }

                #message-input {
                    flex-grow: 1;
                    padding: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }

                #send-button {
                    padding: 10px 20px;
                    margin-left: 10px;
                    background-color: #2889a7;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                #send-button:hover {
                    background-color: #216188;
                }
            `}</style>

            <div id="chat">
                {messages.map((msg, idx) => (
                    <div key={idx} className={`message ${msg.startsWith('You') ? 'message-right' : 'message-left'}`}>
                        {msg}
                    </div>
                ))}
            </div>
            <div id="message-box">
                <input
                    type="text"
                    id="message-input"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Type your message here..."
                />
                <button id="send-button" onClick={sendMessage}>
                    Send
                </button>
            </div>
        </div>
    );
}

