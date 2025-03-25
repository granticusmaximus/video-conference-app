import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import ChatControls from "./ChatControls";

const socket = io("http://localhost:5000"); // Replace with your deployed server if needed

const Chat = ({ roomId = "global" }) => {
  const { user } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    socket.emit("join_room", roomId);

    socket.on("receive_message", (data) => {
      setMessages((prev) => [...prev, data]);
    });

    return () => socket.off("receive_message");
  }, [roomId]);

  const handleSend = () => {
    if (!message.trim()) return;

    const msgData = {
      id: uuidv4(),
      text: message,
      sender: user?.email || "Guest",
      time: new Date().toLocaleTimeString(),
      room: roomId,
    };

    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
    setMessage("");
  };

  const handleFileUpload = (file) => {
    const msgData = {
      id: uuidv4(),
      text: `📎 ${file.name}`,
      sender: user?.email || "Guest",
      time: new Date().toLocaleTimeString(),
      room: roomId,
    };
    socket.emit("send_message", msgData);
    setMessages((prev) => [...prev, msgData]);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-full max-w-xl mx-auto p-4 border rounded shadow-md bg-white">
      <h2 className="text-xl font-semibold mb-2 text-center">💬 Chat Room: {roomId}</h2>

      <div className="h-80 overflow-y-auto border p-3 rounded bg-gray-50">
        {messages.map((msg) => (
          <div key={msg.id} className="mb-2">
            <p className="text-sm text-gray-700">
              <span className="font-semibold">{msg.sender}</span>{" "}
              <span className="text-gray-400 text-xs">({msg.time})</span>
            </p>
            <p className="ml-2 text-gray-900">{msg.text}</p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      <ChatControls
        message={message}
        setMessage={setMessage}
        handleSend={handleSend}
        onFileUpload={handleFileUpload}
      />
    </div>
  );
};

export default Chat;