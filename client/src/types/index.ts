
export interface User {
  id: string;
  name: string;
  email: string;
  profileColor: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest extends LoginRequest {
  name: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Message {
  senderColor: any;
  id: string;
  content: string;
  createdAt: Date | string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  sender?: {
    id: string;
    name: string;
    profileColor: string;
  };
}

export interface OnlineUser {
  userId: string;
  name: string;
  color: string;
}

export interface UserStatus {
  userId: string;
  status: 'online' | 'offline';
  name?: string;
  color?: string;
}

export interface SendMessagePayload {
  content: string;
  receiverId: string;
}

export interface MarkAsReadPayload {
  messageId: string;
}

export interface ConversationPayload {
  otherUserId: string;
}