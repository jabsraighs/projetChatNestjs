
import { io, Socket } from 'socket.io-client';

// URL de l'API backend (à ajuster selon votre configuration)
export const API_URL = 'http://localhost:3000';

let socket: Socket | null = null;

export const getSocket = (token?: string): Socket => {
  if (!socket && token) {
    socket = io(API_URL, {
      auth: {
        token
      }
    });
  }
  return socket as Socket;
};

export const disconnectSocket = (): void => {
  if (socket) {
    socket.disconnect();
    socket = null;
  }
};
