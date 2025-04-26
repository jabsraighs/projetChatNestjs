import React, { useState, useRef, useEffect } from 'react';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import { Message, User } from '@/types';

const ConversationPane: React.FC = () => {
  const { user: currentUser } = useAuth();
  const { selectedConversation, messages, sendMessage, markAsRead } = useChat();
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchUserDetails = async () => {
      if (!selectedConversation) {
        setSelectedUser(null);
        return;
      }

      try {
        const response = await fetch(`http://localhost:5000/users/${selectedConversation}`);
        if (response.ok) {
          const userData = await response.json();
          setSelectedUser(userData);
        }
      } catch (error) {
        console.error('Failed to fetch user details:', error);
      }
    };

    fetchUserDetails();
  }, [selectedConversation]);
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, selectedConversation]);
  useEffect(() => {
    if (!selectedConversation || !messages[selectedConversation]) return;

    messages[selectedConversation].forEach((msg: Message) => {
      if (!msg.isRead && msg.senderId === selectedConversation) {
        markAsRead(msg.id);
      }
    });
  }, [messages, selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMessage.trim() || !selectedConversation || !currentUser) return;

    sendMessage(newMessage, selectedConversation);
    setNewMessage('');
  };

  if (!selectedConversation || !selectedUser) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <div className="text-center text-gray-500">
          <p className="text-lg">Select a conversation to start chatting</p>
        </div>
      </div>
    );
  }

  const conversationMessages = messages[selectedConversation] || [];

  return (
    <div className="flex-1 flex flex-col">
      {/* Header */}
      <div className="p-4 border-b bg-white shadow-sm flex items-center">
        <div 
          className="w-10 h-10 rounded-full flex items-center justify-center mr-3"
          style={{ backgroundColor: selectedUser.profileColor }}
        >
          <span className="text-white font-medium">
            {selectedUser.name.substring(0, 2).toUpperCase()}
          </span>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{selectedUser.name}</h2>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
        {conversationMessages.length === 0 ? (
          <div className="text-center text-gray-500 mt-10">
            <p>No messages yet. Start the conversation!</p>
          </div>
        ) : (
          conversationMessages.map((msg: Message) => (
            <div 
              key={msg.id} 
              className={`mb-4 max-w-xs lg:max-w-md ${
                msg.senderId === currentUser?.id ? 'ml-auto' : 'mr-auto'
              }`}
            >
              <div 
                className={`p-3 rounded-lg ${
                  msg.senderId === currentUser?.id 
                    ? 'bg-blue-500 text-white rounded-br-none' 
                    : 'bg-white border rounded-bl-none'
                }`}
              >
                {msg.content}
              </div>
              <div 
                className={`text-xs text-gray-500 mt-1 ${
                  msg.senderId === currentUser?.id ? 'text-right' : ''
                }`}
              >
                {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                {msg.senderId === currentUser?.id && (
                  <span className="ml-2">{msg.isRead ? '✓✓' : '✓'}</span>
                )}
              </div>
            </div>
          ))
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Message Input */}
      <form onSubmit={handleSendMessage} className="p-4 border-t bg-white">
        <div className="flex">
          <input
            type="text"
            placeholder="Type a message..."
            className="flex-1 border rounded-l-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded-r-lg hover:bg-blue-600 transition"
            disabled={!newMessage.trim()}
          >
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default ConversationPane;