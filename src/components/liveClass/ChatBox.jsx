import React, { useState, useRef, useEffect } from 'react';
import { Send, X } from 'lucide-react';

const ChatBox = ({ messages, onSendMessage, onClose }) => {
  const [message, setMessage] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = (e) => {
    e.preventDefault();
    if (message.trim()) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const formatTime = (date) => {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
      {/* Header */}
      <div className="px-4 py-3 border-b border-gray-700 flex items-center justify-between">
        <h3 className="text-white font-semibold">Chat</h3>
        <button
          onClick={onClose}
          className="text-gray-400 hover:text-white transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {messages.map((msg) => (
          <div key={msg.id} className={`${
            msg.type === 'system' ? 'text-center' : ''
          }`}>
          {msg.type === 'system' ? (
          <p className="text-gray-400 text-xs italic">{msg.message}</p>
          ) : (
          <div className="bg-gray-700 rounded-lg p-3">
          <div className="flex items-center justify-between mb-1">
          <span className="text-blue-400 text-sm font-medium">
          {msg.userName}
          </span>
          <span className="text-gray-500 text-xs">
          {formatTime(msg.timestamp)}
          </span>
          </div>
          <p className="text-white text-sm">{msg.message}</p>
          </div>
          )}
          </div>
          ))}
          <div ref={messagesEndRef} />
          </div>  {/* Input */}
            <form onSubmit={handleSend} className="p-4 border-t border-gray-700">
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="Type a message..."
                  className="flex-1 bg-gray-700 text-white px-3 py-2 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button
                  type="submit"
                  className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded-lg transition"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
            </form>
          </div>
          );
          };export default ChatBox;