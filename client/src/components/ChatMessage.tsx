import React from 'react';
import { Message } from '@/types';
import { useAuth } from '@/context/AuthContext';
import { cn } from '@/lib/utils';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const { user } = useAuth();
  const isCurrentUser = user?.id === message.sender.id;
  
  const formattedTime = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });

  return (
    <div
      className={cn(
        "flex mb-4",
        isCurrentUser ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-xs sm:max-w-md px-4 py-2 rounded-lg",
          isCurrentUser
            ? "bg-primary text-primary-foreground rounded-br-none"
            : "bg-secondary text-secondary-foreground rounded-bl-none"
        )}
      >
        <div className="flex items-center mb-1">
          <span 
            className="font-medium mr-2"
            style={{ color: message.sender.color }}
          >
            {message.sender.username}
          </span>
          <span className="text-xs opacity-70">{formattedTime}</span>
        </div>
        <p className="break-words">{message.content}</p>
      </div>
    </div>
  );
};
