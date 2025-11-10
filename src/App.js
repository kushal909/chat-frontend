import React, { useState, useEffect } from "react";
import { io } from "socket.io-client";

const socket = io("http://65.2.81.219:5000/");

function App() {
  const [username, setUsername] = useState("");
  const [receiver, setReceiver] = useState("");
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);
  const [registered, setRegistered] = useState(false);
  // Listen for messages from server
  useEffect(() => {
    socket.on("private_message", ({ sender, receiver, message }) => {
      setChat((prev) => [...prev, { sender, receiver, message }]);
    });

    return () => socket.off("private_message");
  }, []);

  // Register user
  const handleRegister = () => {
    if (username.trim()) {
      socket.emit("register", username);
      setRegistered(true);
    }
  };

  // Send private message
  const sendMessage = () => {
    if (message.trim() && receiver.trim()) {
      socket.emit("private_message", { sender: username, receiver, message });
      setMessage("");
    }
  };

  return (
    <div
      style={{
        padding: 20,
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        backgroundColor: "#f0f2f5",
        height: "100vh",
      }}
    >
      <h2>💬 Private Chat (React + Node + Socket.IO)</h2>

      {!registered ? (
        // Registration Section
        <div
          style={{
            marginTop: 40,
            display: "flex",
            gap: "10px",
          }}
        >
          <input
            placeholder="Enter your username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              padding: 10,
              width: 250,
              borderRadius: 8,
              border: "1px solid #ccc",
              fontSize: 16,
            }}
          />
          <button
            onClick={handleRegister}
            style={{
              padding: "10px 20px",
              backgroundColor: "#25D366",
              border: "none",
              borderRadius: 8,
              color: "white",
              fontWeight: "bold",
              cursor: "pointer",
            }}
          >
            Register
          </button>
        </div>
      ) : (
        // Chat Section
        <div
          style={{
            width: 420,
            backgroundColor: "#fff",
            borderRadius: 10,
            boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
            padding: 15,
            marginTop: 20,
            display: "flex",
            flexDirection: "column",
          }}
        >
          <h4>👋 Welcome, {username}</h4>

          {/* Receiver Input */}
          <div style={{ marginBottom: 10 }}>
            <input
              type="text"
              placeholder="Send to (receiver name)"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              style={{
                padding: 10,
                width: "100%",
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 15,
              }}
            />
          </div>

          {/* Chat Messages Box */}
          <div
            style={{
              flex: 1,
              border: "1px solid #ccc",
              borderRadius: 10,
              padding: 10,
              height: 350,
              overflowY: "auto",
              backgroundColor: "#e5ddd5",
              marginBottom: 10,
            }}
          >
            {chat.map((msg, i) => {
              const isSender = msg.sender === username;
              return (
                <div
                  key={i}
                  style={{
                    display: "flex",
                    justifyContent: isSender ? "flex-end" : "flex-start",
                    marginBottom: 8,
                  }}
                >
                  <div
                    style={{
                      backgroundColor: isSender ? "#dcf8c6" : "#fff",
                      padding: "8px 12px",
                      borderRadius: 10,
                      maxWidth: "70%",
                      boxShadow: "0 1px 2px rgba(0,0,0,0.2)",
                      textAlign: isSender ? "right" : "left",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.85em",
                        color: isSender ? "#075E54" : "#333",
                        fontWeight: "bold",
                      }}
                    >
                      {isSender ? "You" : msg.sender}
                    </div>
                    <div style={{ marginTop: 2 }}>{msg.message}</div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Message Input */}
          <div style={{ display: "flex", gap: "8px" }}>
            <input
              type="text"
              placeholder="Type message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              style={{
                padding: 10,
                flex: 1,
                borderRadius: 8,
                border: "1px solid #ccc",
                fontSize: 15,
              }}
            />
            <button
              onClick={sendMessage}
              style={{
                padding: "10px 20px",
                backgroundColor: "#128C7E",
                border: "none",
                borderRadius: 8,
                color: "white",
                fontWeight: "bold",
                cursor: "pointer",
              }}
            >
              Send
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
export default App;
