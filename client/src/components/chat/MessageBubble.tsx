import { Message } from '@/types';
import { format } from 'date-fns';
import { CheckCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
  message: Message;
  isSentByCurrentUser: boolean;
}

const MessageBubble = ({ message, isSentByCurrentUser }: MessageBubbleProps) => {
  const formattedTime = format(new Date(message.createdAt), 'HH:mm');
  
  const messageColor = message.senderColor || 
    (isSentByCurrentUser 
      ? message.sender?.profileColor
      : message.sender?.profileColor);
  
  return (
    <div className={cn(
      "flex items-end mb-4",
      isSentByCurrentUser ? 'justify-end' : 'justify-start'
    )}>
      <div
        className={cn(
          "message-bubble",
          isSentByCurrentUser ? 'message-bubble-sent' : 'message-bubble-received'
        )}
        style={messageColor ? {
          backgroundColor: `${messageColor}20`,
          borderLeft: `4px solid ${messageColor}`
        } : {}}
      >
        <div>
          {!isSentByCurrentUser && message.sender && (
            <p className="text-xs font-semibold mb-1" style={{ color: message.sender.profileColor }}>
              {message.sender.name}
            </p>
          )}
          <p className="whitespace-pre-wrap">{message.content}</p>
        </div>
        
        <div className="flex items-center justify-end mt-1 gap-1">
          <span className="text-xs opacity-70">{formattedTime}</span>
          
          {isSentByCurrentUser && (
            <CheckCheck
              size={14}
              className={cn(
                "opacity-70",
                message.isRead ? "text-blue-400" : ""
              )}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default MessageBubble;