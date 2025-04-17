
export interface User {
    id: string;
    username: string;
    color: string;
  }
  
  export interface Message {
    id: string;
    content: string;
    sender: User;
    timestamp: Date;
  }
  
  export interface AuthResponse {
    accessToken: string;
    user: User;
  }
  