import { useEffect, useState, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "../Context/AuthContext";
import { v4 as uuidv4 } from "uuid";

const socket = io("http://localhost:5000"); // Replace with your backend URL if deployed

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

    return () => {
      socket.off("receive_message");
    };
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
    setMessages((prev) => [...prev, msgData]); // Optimistic UI
    setMessage("");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
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

      <div className="mt-3 flex">
        <input
          type="text"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={handleKeyDown}
          className="flex-grow border border-gray-300 rounded-l px-3 py-2 focus:outline-none"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSend}
          className="bg-blue-600 text-white px-4 py-2 rounded-r hover:bg-blue-700"
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default Chat;