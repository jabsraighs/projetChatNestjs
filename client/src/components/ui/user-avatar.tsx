import { User } from "@/types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";

interface UserAvatarProps {
  user: User;
  size?: "sm" | "md" | "lg";
}

export function UserAvatar({ user, size = "md" }: UserAvatarProps) {
  const dimensions = {
    sm: "h-8 w-8",
    md: "h-10 w-10",
    lg: "h-12 w-12",
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <Avatar className={dimensions[size]}>
      <AvatarFallback style={{ backgroundColor: user.color }}>
        {getInitials(user.name)}
      </AvatarFallback>
    </Avatar>
  );
}