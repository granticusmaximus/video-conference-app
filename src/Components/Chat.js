import { useEffect, useState, useRef } from "react";
import { useAuth } from "../Context/AuthContext";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Utils/firebase";
import { collection, addDoc, query, orderBy, onSnapshot } from "firebase/firestore";
import ChatControls from "./ChatControls";

const Chat = ({ roomId = "global" }) => {
  const { user, loading } = useAuth();
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);

  useEffect(() => {
    if (loading) return;

    const q = query(collection(db, "messages", roomId, "chat"), orderBy("timestamp"));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setMessages(snapshot.docs.map(doc => doc.data()));
    });

    return () => unsubscribe();
  }, [roomId, loading]);

  const handleSend = async () => {
    if (!message.trim() || !user) return;

    const msgData = {
      id: uuidv4(),
      text: message,
      sender: user.email,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date(),
    };

    await addDoc(collection(db, "messages", roomId, "chat"), msgData);
    setMessage("");
  };

  const handleFileUpload = async (file) => {
    if (!user) return;

    const msgData = {
      id: uuidv4(),
      text: `📎 ${file.name}`,
      sender: user.email,
      time: new Date().toLocaleTimeString(),
      timestamp: new Date(),
    };

    await addDoc(collection(db, "messages", roomId, "chat"), msgData);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (loading) return <div className="p-6 text-center">Loading chat...</div>;
  if (!user) return <div className="p-6 text-center text-red-500">Please log in to use chat.</div>;

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