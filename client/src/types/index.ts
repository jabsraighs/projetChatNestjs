export interface User {
  id: string;
  name: string;
  email: string;
  color: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export interface Message {
  id: string;
  content: string;
  createdAt: string;
  isRead: boolean;
  senderId: string;
  receiverId: string;
  sender?: User;
  receiver?: User;
}

export interface CreateMessageDto {
  content: string;
  receiverId: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterCredentials {
  name: string;
  email: string;
  password: string;
}