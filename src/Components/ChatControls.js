import { useState, useRef } from "react";
import { BsEmojiSmile, BsFillSendFill, BsPaperclip } from "react-icons/bs";
import Picker from "emoji-picker-react";

const ChatControls = ({ message, setMessage, handleSend, onFileUpload }) => {
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const fileInputRef = useRef(null);

  const onEmojiClick = (emojiObject) => {
    setMessage((prev) => prev + emojiObject.emoji);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handleSend();
  };

  return (
    <div className="relative flex items-center gap-2 mt-3">
      <button
        onClick={() => setShowEmojiPicker((prev) => !prev)}
        className="text-xl text-gray-600 hover:text-gray-800"
      >
        <BsEmojiSmile />
      </button>

      <input
        type="file"
        hidden
        ref={fileInputRef}
        onChange={(e) => onFileUpload(e.target.files[0])}
      />
      <button
        onClick={() => fileInputRef.current.click()}
        className="text-xl text-gray-600 hover:text-gray-800"
      >
        <BsPaperclip />
      </button>

      <input
        type="text"
        className="flex-grow border border-gray-300 rounded px-3 py-2 focus:outline-none"
        placeholder="Type a message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        onKeyDown={handleKeyDown}
      />

      <button
        onClick={handleSend}
        className="bg-blue-600 text-white p-2 rounded hover:bg-blue-700"
      >
        <BsFillSendFill />
      </button>

      {showEmojiPicker && (
        <div className="absolute bottom-14 left-0 z-10">
          <Picker onEmojiClick={onEmojiClick} />
        </div>
      )}
    </div>
  );
};

export default ChatControls;