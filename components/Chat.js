import React, {useState, useEffect, useRef} from 'react';
import io from 'socket.io-client';

export default function Chat() {
    const [messages, setMessages] = useState([]);
    const [message, setMessage] = useState('');
    const [username, setUsername] = useState('');
    const [clients, setClients] = useState([]);
    const [isRegistered, setIsRegistered] = useState(false);
    const socketRef = useRef();

    useEffect(() => {
        socketRef.current = io('http://localhost:3002');

        socketRef.current.on('message', (data) => {
            setMessages((prevMessages) => [...prevMessages, `${data.username}: ${data.message}`]);
        });

        socketRef.current.on('user-joined', (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
            setClients(data.users);
        });

        socketRef.current.on('user-left', (data) => {
            setMessages((prevMessages) => [...prevMessages, data.message]);
            setClients(data.users);
        });

        socketRef.current.on('all-users', (data) => {
            setClients(data.users);
        });

        return () => {
            socketRef.current.disconnect();
        };
    }, []);

    const registerUser = () => {
        if (username.trim()) {
            socketRef.current.emit('register-user', username);
            setIsRegistered(true);
            setMessages((prevMessages) => [...prevMessages, 'You have joined the chat']);
        }
    };

    const sendMessage = () => {
        if (message.trim()) {
            setMessages((prevMessages) => [...prevMessages, `You: ${message}`]);
            socketRef.current.emit('newMessage', {text: message});
            socketRef.current.emit('saveMessage', {text: message});
            setMessage('');
        }
    };

    return (
        <div id="chat-container">
            <style jsx>{`
                #chat-container {
                    display: flex;
                    flex-direction: column;
                    width: 90vw;
                    max-width: 800px;
                    height: 600px; /* Adjust this as needed */
                    margin: 50px auto;
                    background-color: #1B1B20;
                    border-radius: 8px;
                    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                    overflow: hidden;
                }

                #chat {
                    flex-grow: 1;
                    padding: 20px;
                    overflow-y: auto;
                }

                .message {
                    margin-bottom: 10px;
                    padding: 10px;
                    border-radius: 5px;
                    max-width: 70%;
                    clear: both;
                }

                .message-left {
                    color: white;
                    background-color: #303132;
                    border-radius: 20px;
                    float: left;
                }

                .message-right {
                    color: white;
                    background-color: #315FF4;
                    border-radius: 20px;
                    float: right;
                }
                
                .message-center {
                    width: fit-content;
                    color: white;
                    margin-left: 50%;
                    transform: translateX(-50%);
                    text-align: center;
                }

                #message-box {
                    display: flex;
                    align-items: center;
                    padding: 10px;
                    background-color: #1B1B20;
                    position: relative; /* Keep it fixed at the bottom */
                }

                #message-input {
                    flex-grow: 1;
                    padding: 20px;
                    border: 1px solid #ddd;
                    border-radius: 20px;
                    margin-right: 10px;
                    background-color: #303132;
                    color: white;
                }

                #send-button {
                    padding: 20px 20px;
                    background-color: #315FF4;
                    color: white;
                    border: none;
                    border-radius: 20px;
                    cursor: pointer;
                }

                #send-button:hover {
                    background-color: #315FF4;
                }
                
                #send-button i {
                    font-size: 20px;
                }

                #username-input {
                    padding: 10px;
                    width: 100%;
                    margin-bottom: 10px;
                    border: 1px solid #ddd;
                    border-radius: 5px;
                }

                #register-button {
                    padding: 10px 20px;
                    background-color: #2889a7;
                    color: white;
                    border: none;
                    border-radius: 5px;
                    cursor: pointer;
                }

                #register-button:hover {
                    background-color: #216188;
                }
            `}</style>

            {isRegistered ? (
                <>
                    <link rel="stylesheet"
                          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.4/css/all.min.css"/>

                    <div id="chat">
                        {messages.map((msg, idx) => (
                            <div key={idx}
                                 className={`message ${msg.startsWith('You') ? msg.startsWith('You have joined the chat') ? 'message-center' : 'message-right' : msg.endsWith('left the chat') ? 'message-center' : msg.endsWith('joined the chat') ? 'message-center' : 'message-left'}`}>
                                {msg.startsWith('You: ') ? msg.split(': ')[1] : msg}
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
                            <i className="fas fa-paper-plane"></i>
                        </button>
                    </div>
                </>
            ) : (
                <div id="register-form">
                    <input
                        type="text"
                        id="username-input"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        placeholder="Enter your username"
                    />
                    <button id="register-button" onClick={registerUser}>
                        Join Chat
                    </button>
                </div>
            )}
        </div>
    );
}
