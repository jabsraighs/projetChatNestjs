import React, { useState, useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Send } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { getSocket, disconnectSocket } from '@/lib/socket';
import { ChatMessage } from '@/components/ChatMessage';
import { Message, User } from '@/types';
import { getToken } from '@/lib/auth';
import { UserSettings } from '@/components/UserSettings';

export const ChatRoom: React.FC = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [onlineUsers, setOnlineUsers] = useState<User[]>([]);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const { user, logout } = useAuth();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  
  // Se connecter au WebSocket quand le composant est monté
  useEffect(() => {
    const token = getToken();
    if (token) {
      const socket = getSocket(token);
      
      socket.connect();
      
      // Écouter les nouveaux messages
      socket.on('message', (newMessage: Message) => {
        setMessages(prev => [...prev, {
          ...newMessage,
          timestamp: new Date(newMessage.timestamp)
        }]);
      });
      
      // Écouter les mises à jour de la liste des utilisateurs connectés
      socket.on('onlineUsers', (users: User[]) => {
        setOnlineUsers(users);
      });
      
      // Récupérer l'historique des messages
      socket.emit('getHistory', {}, (response: { messages: Message[] }) => {
        setMessages(response.messages.map(msg => ({
          ...msg,
          timestamp: new Date(msg.timestamp)
        })));
      });
      
      return () => {
        socket.off('message');
        socket.off('onlineUsers');
        disconnectSocket();
      };
    }
  }, []);
  
  // Faire défiler vers le bas à chaque nouveau message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = () => {
    if (message.trim() && user) {
      const socket = getSocket();
      
      socket.emit('sendMessage', {
        content: message,
        sender: user
      });
      
      setMessage('');
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const toggleSettings = () => {
    setIsSettingsOpen(!isSettingsOpen);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-full">
      {/* Liste des utilisateurs connectés - Visible uniquement sur les écrans MD et plus grands */}
      <Card className="hidden md:block">
        <CardHeader>
          <CardTitle className="text-lg">Utilisateurs en ligne</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {onlineUsers.map((onlineUser) => (
              <div 
                key={onlineUser.id} 
                className="flex items-center gap-2 p-2 rounded-md hover:bg-secondary/50"
              >
                <div 
                  className="w-3 h-3 rounded-full bg-green-500"
                  style={{ backgroundColor: onlineUser.color }}
                />
                <span className="font-medium">{onlineUser.username}</span>
                {onlineUser.id === user?.id && <span className="text-xs text-muted-foreground">(Vous)</span>}
              </div>
            ))}
            {onlineUsers.length === 0 && (
              <p className="text-muted-foreground text-sm">Aucun utilisateur connecté</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Zone principale du chat */}
      <Card className="md:col-span-3 flex flex-col h-[80vh]">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">Chat en direct</CardTitle>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={toggleSettings}
              >
                Profil
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={logout}
              >
                Déconnexion
              </Button>
            </div>
          </div>
          <Separator className="my-2" />
        </CardHeader>
        
        <CardContent className="flex-grow flex flex-col overflow-hidden p-4">
          {/* Messages */}
          <ScrollArea className="flex-grow pr-4">
            <div className="space-y-4">
              {messages.map((msg) => (
                <ChatMessage key={msg.id} message={msg} />
              ))}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>
          
          {/* Input */}
          <div className="mt-4 flex items-center space-x-2">
            <Input
              placeholder="Tapez votre message..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-grow"
            />
            <Button 
              onClick={handleSendMessage} 
              size="icon"
              disabled={!message.trim()}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Modal des paramètres utilisateur */}
      {isSettingsOpen && (
        <UserSettings onClose={toggleSettings} />
      )}
    </div>
  );
};