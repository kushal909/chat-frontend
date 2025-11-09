import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://localhost:5000"); // connect to backend

function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // Listen for messages from the server
    socket.on("messageFromServer", (data) => {
      setChat((prev) => [...prev, data]);
    });

    // Cleanup on unmount
    return () => {
      socket.off("messageFromServer");
    };
  }, []);

  const sendMessage = () => {
    if (message.trim()) {
      socket.emit("messageFromClient", message); // send to server
      setMessage("");
    }
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🔄 React ↔ Node Two-Way Chat</h2>
      <div style={{ marginBottom: 10 }}>
        <input
          type="text"
          placeholder="Type message..."
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          style={{ padding: 10, width: 300 }}
        />
        <button onClick={sendMessage} style={{ marginLeft: 10, padding: 10 }}>
          Send
        </button>
      </div>

      <ul>
        {chat.map((msg, i) => (
          <li key={i}>{msg}</li>
        ))}
      </ul>
    </div>
  );
}

export default App;
