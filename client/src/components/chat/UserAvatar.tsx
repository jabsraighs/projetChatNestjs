import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';

interface UserAvatarProps {
  name: string;
  color?: string;
  status?: 'online' | 'offline';
  size?: 'sm' | 'md' | 'lg';
  showStatus?: boolean;
}

const UserAvatar = ({ 
  name, 
  color = '#3498db', 
  status,
  size = 'md',
  showStatus = true
}: UserAvatarProps) => {
  const getInitials = (name: string): string => {
    return name
      .split(' ')
      .map(part => part[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };
  const sizeClasses = {
    sm: 'h-8 w-8 text-xs',
    md: 'h-10 w-10 text-sm',
    lg: 'h-14 w-14 text-base'
  };
  
  return (
    <div className="relative">
      <Avatar className={cn(sizeClasses[size])}>
        <AvatarFallback style={{ backgroundColor: color }}>
          {getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {showStatus && status && (
        <span 
          className={cn(
            "absolute bottom-0 right-0 rounded-full border-2 border-background",
            status === 'online' ? 'online-indicator' : 'offline-indicator'
          )}
        />
      )}
    </div>
  );
};

export default UserAvatar;