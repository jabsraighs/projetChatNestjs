import React, { createContext, useContext, useState, useEffect } from 'react';
import { io, Socket } from 'socket.io-client';
import { useAuth } from './AuthContext';
import { OnlineUser, UserStatus, Message } from '@/types';
import { useToast } from '@/components/ui/use-toast';

interface ChatContextType {
  socket: Socket | null;
  onlineUsers: OnlineUser[];
  messages: Record<string, Message[]>;
  sendMessage: (content: string, receiverId: string) => void;
  markAsRead: (messageId: string) => void;
  loadConversation: (otherUserId: string) => void;
  selectedConversation: string | null;
  setSelectedConversation: (userId: string | null) => void;
  isConnected: boolean;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

const SOCKET_URL = 'http://localhost:5000';

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { token, user, isAuthenticated } = useAuth();
  const [socket, setSocket] = useState<Socket | null>(null);
  const [onlineUsers, setOnlineUsers] = useState<OnlineUser[]>([]);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [selectedConversation, setSelectedConversation] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState<boolean>(false);
  
  const { toast } = useToast();

  useEffect(() => {
    if (!isAuthenticated || !token) {
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    const newSocket = io(SOCKET_URL, {
      auth: {
        token
      }
    });

    newSocket.on('connect', () => {
      console.log('Connected to WebSocket server');
      setIsConnected(true);
    });

    newSocket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      setIsConnected(false);
    });

    newSocket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect to chat server",
        variant: "destructive",
      });
      setIsConnected(false);
    });

    
    newSocket.on('onlineUsers', (users: OnlineUser[]) => {
      setOnlineUsers(users);
    });

    newSocket.on('userStatus', (userStatus: UserStatus) => {
      if (userStatus.status === 'online' && userStatus.name && userStatus.color) {
       
        setOnlineUsers(prev => {
          if (!prev.find(u => u.userId === userStatus.userId)) {
            return [...prev, {
              userId: userStatus.userId,
              name: userStatus.name,
              color: userStatus.color
            }];
          }
          return prev;
        });
      } else if (userStatus.status === 'offline') {
  
        setOnlineUsers(prev => prev.filter(u => u.userId !== userStatus.userId));
      }
    });

    newSocket.on('newMessage', (message: Message) => {
      setMessages(prev => {
        const otherUserId = message.senderId === user?.id ? message.receiverId : message.senderId;
        const conversationMessages = [...(prev[otherUserId] || [])];
        
     
        if (!conversationMessages.find(m => m.id === message.id)) {

          conversationMessages.push({
            ...message,
   
            senderColor: message.senderId === user?.id 
              ? (message.senderColor || user?.profileColor)
              : message.senderColor
          });

          conversationMessages.sort((a, b) => 
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        }
        
        return {
          ...prev,
          [otherUserId]: conversationMessages
        };
      });

      if (message.senderId !== user?.id && message.senderId !== selectedConversation) {
        toast({
          title: `New message from ${message.sender?.name || 'Someone'}`,
          description: message.content.length > 30 
            ? `${message.content.substring(0, 30)}...` 
            : message.content,
        });
      }
    });

    setSocket(newSocket);

    newSocket.emit('getUnreadMessages', (response: any) => {
      if (response.success && response.messages) {
        const groupedMessages: Record<string, Message[]> = {};
        
        response.messages.forEach((msg: Message) => {
          const otherUserId = msg.senderId === user?.id ? msg.receiverId : msg.senderId;
          if (!groupedMessages[otherUserId]) {
            groupedMessages[otherUserId] = [];
          }
       
          groupedMessages[otherUserId].push({
            ...msg,

            senderColor: msg.senderColor || 
              (msg.senderId === user?.id ? user.profileColor : msg.sender?.profileColor)
          });
        });
        
        setMessages(groupedMessages);
      }
    });

    return () => {
      newSocket.disconnect();
    };
  }, [isAuthenticated, token, user?.id]);

  useEffect(() => {
    if (selectedConversation && socket) {
      loadConversation(selectedConversation);
    }
  }, [selectedConversation]);

  const sendMessage = (content: string, receiverId: string) => {
    if (!socket || !content.trim() || !receiverId) return;
    
    // Important: S'assurer que la couleur est envoyée avec le message
    const messageColor = user?.profileColor;
    socket.emit('sendMessage', { 
      content, 
      receiverId,
      senderColor: messageColor
    });
  };

  const markAsRead = (messageId: string) => {
    if (!socket || !messageId) return;
    
    socket.emit('markAsRead', { messageId });
  };

  const loadConversation = (otherUserId: string) => {
    if (!socket || !otherUserId) return;
    
    socket.emit('getConversation', { otherUserId }, (response: any) => {
      if (response.success && response.messages) {
        // Traiter les messages pour préserver les couleurs d'origine
        const processedMessages = response.messages.map((msg: Message) => ({
          ...msg,
          // Ne pas remplacer senderColor s'il existe déjà
          senderColor: msg.senderColor || 
            (msg.senderId === user?.id ? user.profileColor : msg.sender?.profileColor)
        }));

        setMessages(prev => ({
          ...prev,
          [otherUserId]: processedMessages
        }));

        processedMessages.forEach((message: Message) => {
          if (!message.isRead && message.senderId === otherUserId) {
            markAsRead(message.id);
          }
        });
      }
    });
  };

  const contextValue: ChatContextType = {
    socket,
    onlineUsers,
    messages,
    sendMessage,
    markAsRead,
    loadConversation,
    selectedConversation,
    setSelectedConversation,
    isConnected
  };

  return (
    <ChatContext.Provider value={contextValue}>
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = (): ChatContextType => {
  const context = useContext(ChatContext);
  if (context === undefined) {
    throw new Error('useChat must be used within a ChatProvider');
  }
  return context;
};