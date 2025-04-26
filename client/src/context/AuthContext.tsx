import React, { createContext, useContext, useState, useEffect } from 'react';
import { AuthState, LoginRequest, RegisterRequest, AuthResponse } from '../types';
import { useToast } from '@/components/ui/use-toast';


const API_URL = 'http://localhost:5000';

interface AuthContextType extends AuthState {
  login: (credentials: LoginRequest) => Promise<boolean>;
  register: (userData: RegisterRequest) => Promise<boolean>;
  logout: () => void;
  updateProfileColor: (color: string) => Promise<boolean>;
}

const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const savedToken = localStorage.getItem('token');
    const savedUser = localStorage.getItem('user');
    
    if (savedToken && savedUser) {
      return {
        token: savedToken,
        user: JSON.parse(savedUser),
        isAuthenticated: true
      };
    }
    return initialState;
  });
  
  const { toast } = useToast();

  useEffect(() => {
    console.log('Auth state updated:', authState);
    if (authState.token && authState.user) {
      console.log('Saving user to localStorage:', authState.user);
      localStorage.setItem('token', authState.token);
      localStorage.setItem('user', JSON.stringify(authState.user));
    } else {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
  }, [authState]);

  const login = async (credentials: LoginRequest): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
  
      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Login Failed",
          description: errorData.message || "Invalid credentials",
          variant: "destructive",
        });
        return false;
      }
  
      const data = await response.json();
      console.log('Login response data:', data);
      
      if (!data.access_token) {
        console.error('No access token in response');
        toast({
          title: "Login Error",
          description: "Authentication data missing in response",
          variant: "destructive",
        });
        return false;
      }

      const token = data.access_token;
      const payload = JSON.parse(atob(token.split('.')[1]));
      
      const userData = {
        id: payload.id,
        email: payload.email,
        name: payload.name,
        profileColor: payload.profileColor
      };
      
      setAuthState({
        user: userData,
        token: token,
        isAuthenticated: true
      });
      return true;
    } catch (error) {
      console.error('Login error:', error);
      toast({
        title: "Login Error",
        description: "Unable to connect to the server",
        variant: "destructive",
      });
      return false;
    }
  };

  const register = async (userData: RegisterRequest): Promise<boolean> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        toast({
          title: "Registration Failed",
          description: errorData.message || "Unable to register",
          variant: "destructive",
        });
        return false;
      }

      toast({
        title: "Registration Successful",
        description: "Please login with your new account",
      });
      return true;
    } catch (error) {
      console.error('Registration error:', error);
      toast({
        title: "Registration Error",
        description: "Unable to connect to the server",
        variant: "destructive",
      });
      return false;
    }
  };

  const logout = () => {
    setAuthState(initialState);
  };

  const updateProfileColor = async (color: string): Promise<boolean> => {
    if (!authState.token || !authState.user) {
      return false;
    }

    try {
      const response = await fetch(`${API_URL}/users/profile-color`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`,
        },
        body: JSON.stringify({ profileColor: color }),
      });

      if (!response.ok) {
        toast({
          title: "Update Failed",
          description: "Failed to update profile color",
          variant: "destructive",
        });
        return false;
      }

      setAuthState({
        ...authState,
        user: {
          ...authState.user,
          profileColor: color
        }
      });
      
      toast({
        title: "Profile Updated",
        description: "Your profile color has been updated",
      });
      return true;
    } catch (error) {
      console.error('Profile update error:', error);
      toast({
        title: "Update Error",
        description: "Unable to connect to the server",
        variant: "destructive",
      });
      return false;
    }
  };

  const contextValue: AuthContextType = {
    ...authState,
    login,
    register,
    logout,
    updateProfileColor
  };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
