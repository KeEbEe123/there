import React, { useState, useRef, useEffect } from "react";

const Chat = ({ socket, room, onClose, username, messages, sendMessage }) => {
  const [newMessage, setNewMessage] = useState("");
  const chatEndRef = useRef(null);

  const handleSendMessage = () => {
    sendMessage(newMessage);
    setNewMessage(""); // Clear the input after sending
  };

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="fixed bottom-0 right-0 w-70 h-4/5 bg-slate-500/80 font-pixelify text-white p-4 shadow-lg z-50 rounded-xl transition-all ease-in-out">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg">Chat</h2>
        <button onClick={onClose} className="text-white hover:text-gray-300">
          ✕
        </button>
      </div>
      <div className="overflow-y-auto h-4/5 mb-4 bg-gray-900 p-2 rounded">
        {messages.map((msg, index) => (
          <div key={index} className="mb-2">
            <span className="text-slate-300">{msg.sender}: </span>
            <span>{msg.content}</span>
          </div>
        ))}
        <div ref={chatEndRef} />
      </div>
      <div className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          className="flex-grow p-2 bg-gray-700 rounded-l"
          placeholder="Type a message..."
        />
        <button
          onClick={handleSendMessage}
          className="p-2 bg-blue-500 rounded-r hover:bg-blue-600"
        >
          <i class="bi bi-arrow-bar-up"></i>
        </button>
      </div>
    </div>
  );
};

export default Chat;
