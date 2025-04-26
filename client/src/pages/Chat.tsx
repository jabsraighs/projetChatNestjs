import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import { useChat } from '@/context/ChatContext';
import UsersList from '@/components/chat/UsersList';
import ChatWindow from '@/components/chat/ChatWindows';
import UserAvatar from '@/components/chat/UserAvatar';
import { Button } from '@/components/ui/button';
import { LogOut } from 'lucide-react';
import ProfileSettings from '@/components/profile/ProfileSettings';
import { ChatProvider } from '@/context/ChatContext';
import { Separator } from '@/components/ui/separator';

const Chat = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated || !user) {
      console.log('Auth state:', { isAuthenticated, user });
      navigate('/login');
    }
  }, [isAuthenticated, user, navigate]);

  if (!isAuthenticated || !user) {
    console.log(isAuthenticated , user)
    return null;
  }
  
  return (
    <div className="h-screen flex flex-col">

      <header className="bg-primary text-primary-foreground p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-xl font-bold">Nest Chat Connect</h1>
          
          <div className="flex items-center gap-2">
            <ProfileSettings />
            
            <Button variant="ghost" size="icon" onClick={logout}>
              <LogOut size={20} />
            </Button>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">

        <div className="w-full max-w-[280px] border-r">

          <div className="p-4 border-b flex items-center">
            <UserAvatar 
              name={user.name} 
              color={user.profileColor}
              status="online"
            />
            <div className="ml-3 truncate">
              <p className="font-medium truncate">{user.name}</p>
              <p className="text-xs text-muted-foreground truncate">{user.email}</p>
            </div>
          </div>

          <UsersList />
        </div>

        <div className="flex-1">
          <ChatWindow />
        </div>
      </div>
    </div>
  );
};

const ChatWithProvider = () => (
  <ChatProvider>
    <Chat />
  </ChatProvider>
);

export default ChatWithProvider;