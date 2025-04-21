import { API_URL } from './socket';
import { AuthResponse, User } from '../types';

export const setToken = (token: string): void => {
  localStorage.setItem('access_token', token);
};

export const getToken = (): string | null => {
  return localStorage.getItem('access_token');
};

export const setUser = (user: User): void => {
  localStorage.setItem('chat_user', JSON.stringify(user));
};

export const getUser = (): User | null => {
  const user = localStorage.getItem('access_token');
  return user ? JSON.parse(user) : null;
};

export const clearAuth = (): void => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('access_token');
};

export const register = async (email: string, name:string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, name,password, color: '#6366f1' })
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de l\'inscription');
    }
    
    const data = await response.json();
    setToken(data.accessToken);
    setUser(data.user);
    return data;
  } catch (error) {
    console.error('Erreur d\'inscription:', error);
    throw error;
  }
};

export const login = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ email, password })
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la connexion');
    }
    
    const data = await response.json();
    setToken(data.accessToken);
    setUser(data.user);
    return data;
  } catch (error) {
    console.error('Erreur de connexion:', error);
    throw error;
  }
};



export const updateUserColor = async (color: string): Promise<User> => {
  const token = getToken();
  
  if (!token) {
    throw new Error('Non authentifié');
  }
  
  try {
    const response = await fetch(`${API_URL}/users/profile/color`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ color })
    });
    
    if (!response.ok) {
      throw new Error('Erreur lors de la mise à jour de la couleur');
    }
    
    const user = await response.json();
    setUser(user);
    return user;
  } catch (error) {
    console.error('Erreur de mise à jour de couleur:', error);
    throw error;
  }
};
