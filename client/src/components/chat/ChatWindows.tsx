import { useState, useEffect, useRef } from 'react';
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';
import MessageBubble from './MessageBubble';
import UserAvatar from './UserAvatar';
import { Message, OnlineUser } from '@/types';

const ChatWindow = () => {
  const { 
    messages, 
    sendMessage, 
    selectedConversation, 
    onlineUsers,
    loadConversation
  } = useChat();
  const { user } = useAuth();
  const [messageInput, setMessageInput] = useState('');
  const scrollAreaRef = useRef<HTMLDivElement>(null);

  const selectedUser = onlineUsers.find(u => u.userId === selectedConversation) as OnlineUser | undefined;

  const conversationMessages = selectedConversation 
    ? messages[selectedConversation] || []
    : [];
  useEffect(() => {
    if (scrollAreaRef.current) {
      const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
      if (scrollContainer) {
        scrollContainer.scrollTop = scrollContainer.scrollHeight;
      }
    }
  }, [conversationMessages]);

  useEffect(() => {
    if (selectedConversation) {
      loadConversation(selectedConversation);
    }
  }, [selectedConversation]);

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!messageInput.trim() || !selectedConversation || !user) return;
    
    sendMessage(messageInput, selectedConversation);
    setMessageInput('');
  };
  
  if (!selectedConversation) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center p-8 max-w-md">
          <h3 className="text-xl font-semibold mb-2">Select a conversation</h3>
          <p className="text-muted-foreground">
            Choose a user from the list to start chatting
          </p>
        </div>
      </div>
    );
  }
  
  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center p-4 border-b">
        {selectedUser && (
          <>
            <UserAvatar 
              name={selectedUser.name} 
              color={selectedUser.color} 
              status="online"
            />
            <div className="ml-3">
              <h3 className="font-medium">{selectedUser.name}</h3>
              <p className="text-xs text-muted-foreground">Online</p>
            </div>
          </>
        )}
      </div>
      <ScrollArea className="flex-grow p-4" ref={scrollAreaRef}>
        {conversationMessages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <p className="text-muted-foreground mb-2">No messages yet</p>
            <p className="text-sm">Start the conversation by sending a message</p>
          </div>
        ) : (
          conversationMessages.map((message: Message) => (
            <MessageBubble
              key={message.id}
              message={message}
              isSentByCurrentUser={message.senderId === user?.id}
            />
          ))
        )}
      </ScrollArea>
      <div className="p-4 border-t">
        <form onSubmit={handleSendMessage} className="flex gap-2">
          <Input
            value={messageInput}
            onChange={(e) => setMessageInput(e.target.value)}
            placeholder="Type a message..."
            className="flex-grow"
          />
          <Button type="submit" disabled={!messageInput.trim()}>
            <Send size={18} />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
