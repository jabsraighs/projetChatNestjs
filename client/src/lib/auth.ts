import { API_URL } from './socket';
import { AuthResponse, User } from '../types';

// Sauvegarde du token dans le localStorage
export const setToken = (token: string): void => {
  localStorage.setItem('chat_token', token);
};

// Récupération du token depuis le localStorage
export const getToken = (): string | null => {
  return localStorage.getItem('chat_token');
};

// Sauvegarde des informations utilisateur dans le localStorage
export const setUser = (user: User): void => {
  localStorage.setItem('chat_user', JSON.stringify(user));
};

// Récupération des informations utilisateur depuis le localStorage
export const getUser = (): User | null => {
  const user = localStorage.getItem('chat_user');
  return user ? JSON.parse(user) : null;
};

// Suppression des infos d'authentification (déconnexion)
export const clearAuth = (): void => {
  localStorage.removeItem('chat_token');
  localStorage.removeItem('chat_user');
};

// Fonction pour l'inscription
export const register = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password, color: '#6366f1' }) // Couleur par défaut
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

// Fonction pour la connexion
export const login = async (username: string, password: string): Promise<AuthResponse> => {
  try {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ username, password })
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

// Fonction pour mettre à jour la couleur du profil
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
