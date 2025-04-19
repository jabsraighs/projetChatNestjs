
import React from 'react';
import { ChatRoom } from '@/components/ChatRoom';

const ChatPage: React.FC = () => {
  return (
    <div className="container mx-auto p-4 max-w-6xl">
      <ChatRoom />
    </div>
  );
};

export default ChatPage;