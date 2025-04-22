import { createContext, useContext, useEffect, useState } from 'react';
import { io, Socket } from 'socket.io-client';
import { User, Message, CreateMessageDto } from '@/types';
import { useAuth } from './AuthContext';
import api from '@/lib/api';
import { useToast } from '@/components/ui/use-toast';

interface ChatContextType {
  messages: Message[];
  users: User[];
  currentReceiver: User | null;
  setCurrentReceiver: (user: User | null) => void;
  sendMessage: (message: CreateMessageDto) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const ChatContext = createContext<ChatContextType>({
  messages: [],
  users: [],
  currentReceiver: null,
  setCurrentReceiver: () => {},
  sendMessage: async () => {},
  isLoading: false,
  error: null
});

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [currentReceiver, setCurrentReceiver] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  const { user, token } = useAuth();
  const { toast } = useToast();
  
  // Initialize socket connection
  useEffect(() => {
    if (token && user) {
      const socketInstance = io('http://localhost:5000', {
        auth: {
          token
        }
      });
      
      setSocket(socketInstance);
      
      // Clean up socket on unmount
      return () => {
        socketInstance.disconnect();
      };
    }
  }, [token, user]);
  
  // Socket event listeners
  useEffect(() => {
    if (socket) {
      socket.on('connect', () => {
        console.log('Connected to socket server');
      });
      
      socket.on('usersList', (updatedUsers: User[]) => {
        setUsers(updatedUsers.filter(u => u.id !== user?.id));
      });
      
      socket.on('message', (newMessage: Message) => {
        setMessages(prevMessages => [newMessage, ...prevMessages]);
        
        if (newMessage.senderId !== user?.id) {
          toast({
            title: 'New Message',
            description: `${newMessage.sender?.name || 'Someone'}: ${newMessage.content}`,
          });
        }
      });
      
      socket.on('disconnect', () => {
        console.log('Disconnected from socket server');
      });
      
      socket.on('error', (err) => {
        console.error('Socket error:', err);
        setError('Connection error. Please try again later.');
      });
      
      // Clean up listeners
      return () => {
        socket.off('connect');
        socket.off('usersList');
        socket.off('message');
        socket.off('disconnect');
        socket.off('error');
      };
    }
  }, [socket, user, toast]);
  
  // Load messages when current receiver changes
  useEffect(() => {
    const fetchMessages = async () => {
      if (!currentReceiver) return;
      
      setIsLoading(true);
      try {
        const response = await api.get(`/messages/conversation/${currentReceiver.id}`);
        setMessages(response.data);
        setError(null);
      } catch (error: any) {
        console.error('Error fetching messages:', error);
        setError(error.response?.data?.message || 'Failed to load messages');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchMessages();
  }, [currentReceiver]);
  
  // Load users on initial render
  useEffect(() => {
    const fetchUsers = async () => {
      if (!user) return;
      
      setIsLoading(true);
      try {
        const response = await api.get('/users');
        setUsers(response.data.filter((u: User) => u.id !== user.id));
        setError(null);
      } catch (error: any) {
        console.error('Error fetching users:', error);
        setError(error.response?.data?.message || 'Failed to load users');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchUsers();
  }, [user]);
  
  const sendMessage = async (messageData: CreateMessageDto) => {
    if (!socket || !currentReceiver) return;
    
    try {
      const response = await api.post('/messages', messageData);
      setMessages(prevMessages => [response.data, ...prevMessages]);
    } catch (error: any) {
      console.error('Error sending message:', error);
      setError(error.response?.data?.message || 'Failed to send message');
      toast({
        variant: 'destructive',
        title: 'Failed to Send',
        description: 'Your message could not be sent. Please try again.',
      });
    }
  };
  
  return (
    <ChatContext.Provider
      value={{
        messages,
        users,
        currentReceiver,
        setCurrentReceiver,
        sendMessage,
        isLoading,
        error
      }}
    >
      {children}
    </ChatContext.Provider>
  );
};

export const useChat = () => useContext(ChatContext);