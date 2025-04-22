import { useEffect, useRef } from "react";
import { Message, User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface MessageListProps {
  messages: Message[];
  currentUser: User;
}

const MessageList = ({ messages, currentUser }: MessageListProps) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4">
      <div className="space-y-4">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full p-6">
            <p className="text-muted-foreground italic">No messages yet. Start the conversation!</p>
          </div>
        ) : (
          messages.map((message) => {
            const isCurrentUser = message.senderId === currentUser.id;
            const senderColor = isCurrentUser ? currentUser.color : message.sender?.color || '#333';
            
            return (
              <div 
                key={message.id}
                className={cn(
                  "flex",
                  isCurrentUser ? "justify-end" : "justify-start"
                )}
              >
                <div className="flex flex-col max-w-[75%]">
                  {!isCurrentUser && (
                    <div
                      className="h-8 w-8 rounded-full flex items-center justify-center text-white text-sm font-medium mb-1"
                      style={{ backgroundColor: senderColor }}
                    >
                      {message.sender?.name.charAt(0).toUpperCase() || '?'}
                    </div>
                  )}
                  
                  <div
                    className={cn(
                      "rounded-lg px-4 py-2 break-words",
                      isCurrentUser 
                        ? "bg-primary text-primary-foreground"
                        : "bg-muted"
                    )}
                    style={{
                      borderLeftColor: !isCurrentUser ? senderColor : undefined,
                      borderLeftWidth: !isCurrentUser ? '4px' : undefined
                    }}
                  >
                    <p>{message.content}</p>
                  </div>
                  
                  <span className="text-[10px] text-muted-foreground mt-1 px-2">
                    {formatDistanceToNow(new Date(message.createdAt), { addSuffix: true })}
                  </span>
                </div>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
};

export default MessageList;
