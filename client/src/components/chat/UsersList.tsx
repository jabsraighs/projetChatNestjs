import { User } from "@/types";
import { ScrollArea } from "@/components/ui/scroll-area";
import { UserAvatar } from "../ui/user-avatar";

interface UsersListProps {
  users: User[];
  currentReceiver: User | null;
  onSelectUser: (user: User) => void;
}

const UsersList = ({ users, currentReceiver, onSelectUser }: UsersListProps) => {
  return (
    <ScrollArea className="h-[calc(100vh-200px)]">
      <div className="px-1 py-2">
        {users.length === 0 ? (
          <div className="text-center text-muted-foreground py-8">
            No users online
          </div>
        ) : (
          <div className="space-y-1">
            {users.map((user) => (
              <button
                key={user.id}
                onClick={() => onSelectUser(user)}
                className={`w-full flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground ${
                  currentReceiver?.id === user.id ? "bg-accent text-accent-foreground" : ""
                }`}
              >
                <UserAvatar user={user} />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{user.name}</span>
                  <span className="text-xs text-muted-foreground truncate max-w-[150px]">
                    {user.email}
                  </span>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </ScrollArea>
  );
};

export default UsersList;