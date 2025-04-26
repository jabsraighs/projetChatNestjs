import { ScrollArea } from '@/components/ui/scroll-area';
import UserAvatar from './UserAvatar';
import { useChat } from '@/context/ChatContext';
import { useAuth } from '@/context/AuthContext';

const UsersList = () => {
  const { onlineUsers, selectedConversation, setSelectedConversation } = useChat();
  const { user } = useAuth();

  const filteredUsers = onlineUsers.filter(onlineUser => onlineUser.userId !== user?.id);
  
  return (
    <div className="w-full h-full">
      <div className="p-4 border-b">
        <h3 className="font-semibold">Online Users ({filteredUsers.length})</h3>
      </div>
      
      <ScrollArea className="h-[calc(100%-56px)]">
        <div className="p-2">
          {filteredUsers.length === 0 ? (
            <div className="text-center text-muted-foreground p-4">
              No users online
            </div>
          ) : (
            filteredUsers.map(onlineUser => (
              <button
                key={onlineUser.userId}
                className={`w-full flex items-center p-3 mb-1 rounded-lg hover:bg-accent transition-colors ${
                  selectedConversation === onlineUser.userId ? 'bg-accent' : ''
                }`}
                onClick={() => setSelectedConversation(onlineUser.userId)}
              >
                <UserAvatar 
                  name={onlineUser.name} 
                  color={onlineUser.color}
                  status="online"
                />
                <div className="ml-3 text-left">
                  <p className="font-medium">{onlineUser.name}</p>
                </div>
              </button>
            ))
          )}
        </div>
      </ScrollArea>
    </div>
  );
};

export default UsersList;