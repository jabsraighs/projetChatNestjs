import { createContext, useContext, useEffect, useState } from 'react';
import { AuthState, LoginCredentials, RegisterCredentials, User } from '@/types';
import api from '@/lib/api';
import { useNavigate } from 'react-router-dom';
import { useToast } from '@/components/ui/use-toast';

interface AuthContextType extends AuthState {
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (credentials: RegisterCredentials) => Promise<void>;
  logout: () => void;
  updateUserColor: (color: string) => Promise<void>;
  checkAuthStatus: () => boolean;
}

// Récupération du token séparément pour mieux déboguer
const storedToken = localStorage.getItem('token');
console.log('[Auth Debug] Initial token from localStorage:', storedToken ? 'exists' : 'not found');

const initialState: AuthState = {
  user: null,
  token: storedToken,
  isAuthenticated: !!storedToken, // Set to true if token exists
  isLoading: true,
  error: null
};

console.log('[Auth Debug] Initial state:', initialState);

const AuthContext = createContext<AuthContextType>({
  ...initialState,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUserColor: async () => {},
  checkAuthStatus: () => false
});

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [state, setState] = useState<AuthState>(initialState);
  const navigate = useNavigate();
  const { toast } = useToast();

  // Debug log pour suivre les changements d'état d'authentification
  useEffect(() => {
    console.log('[Auth Debug] Auth state changed:', {
      isAuthenticated: state.isAuthenticated,
      hasToken: !!state.token,
      isLoading: state.isLoading,
      hasUser: !!state.user
    });
  }, [state]);

  // Séparer l'effet de vérification du token du state.token pour éviter les boucles
  useEffect(() => {
    const fetchCurrentUser = async () => {
      const currentToken = localStorage.getItem('token');
      
      if (currentToken) {
        console.log('[Auth Debug] Token found, validating session...');
        try {
          // Configure l'en-tête d'autorisation
          api.defaults.headers.common['Authorization'] = `Bearer ${currentToken}`;
          
          const response = await api.get('/auth/me');
          console.log('[Auth Debug] User session validated:', response.data);
          
          setState(prevState => ({
            ...prevState,
            user: response.data,
            token: currentToken,
            isAuthenticated: true,
            isLoading: false,
            error: null
          }));
        } catch (error: any) {
          console.error('[Auth Debug] Session validation failed:', error.response?.data || error);
          localStorage.removeItem('token');
          delete api.defaults.headers.common['Authorization'];
          
          setState(prevState => ({
            ...prevState,
            user: null,
            token: null,
            isAuthenticated: false,
            isLoading: false,
            error: 'Session expired. Please login again.'
          }));
          
          toast({
            variant: 'destructive',
            title: 'Session Expired',
            description: 'Please login again to continue.',
          });
        }
      } else {
        console.log('[Auth Debug] No token found, not authenticated');
        setState(prevState => ({
          ...prevState,
          isLoading: false,
          isAuthenticated: false
        }));
      }
    };

    fetchCurrentUser();

  }, [toast]);

  const login = async (credentials: LoginCredentials) => {
    try {
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      
      const response = await api.post('/auth/login', credentials);
      const { access_token, user } = response.data;
  
      localStorage.setItem('token', access_token);
      api.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;
     
      setState({
        user,
        token: access_token,
        isAuthenticated: true,
        isLoading: false,
        error: null
      });
      navigate('/chat');
      toast({
        title: 'Login Successful',
        description: `Welcome back, ${credentials.email}!`,
      });
    } catch (error: any) {
      console.error('[Auth Debug] Login failed:', error.response?.data || error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to login'
      }));
      toast({
        variant: 'destructive',
        title: 'Login Failed',
        description: error.response?.data?.message || 'Failed to login',
      });
    }
  };

  const register = async (credentials: RegisterCredentials) => {
    try {
      console.log('[Auth Debug] Attempting registration:', { email: credentials.email });
      setState(prevState => ({ ...prevState, isLoading: true, error: null }));
      await api.post('/users', credentials);
      
      console.log('[Auth Debug] Registration successful');
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: null
      }));
      
      toast({
        title: 'Registration Successful',
        description: 'Your account has been created. You can now login.',
      });
      
      navigate('/login');
    } catch (error: any) {
      console.error('[Auth Debug] Registration failed:', error.response?.data || error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to register'
      }));
      toast({
        variant: 'destructive',
        title: 'Registration Failed',
        description: error.response?.data?.message || 'Failed to register',
      });
    }
  };

  const logout = () => {
    console.log('[Auth Debug] Logging out, removing token');
    localStorage.removeItem('token');
    delete api.defaults.headers.common['Authorization'];
    
    setState({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null
    });
    
    navigate('/login');
    toast({
      title: 'Logged Out',
      description: 'You have been logged out successfully.',
    });
  };

  const updateUserColor = async (color: string) => {
    try {
      console.log('[Auth Debug] Updating user color to:', color);
      setState(prevState => ({ ...prevState, isLoading: true }));
      
      const response = await api.patch('/users/profile/color', { color });
      console.log('[Auth Debug] Color update successful');
      
      setState(prevState => ({
        ...prevState,
        user: { ...prevState.user!, color },
        isLoading: false
      }));
      
      toast({
        title: 'Profile Updated',
        description: 'Your profile color has been updated.',
      });
    } catch (error: any) {
      console.error('[Auth Debug] Color update failed:', error.response?.data || error);
      setState(prevState => ({
        ...prevState,
        isLoading: false,
        error: error.response?.data?.message || 'Failed to update profile color'
      }));
      
      toast({
        variant: 'destructive',
        title: 'Update Failed',
        description: error.response?.data?.message || 'Failed to update profile color',
      });
    }
  };

  // Fonction de vérification d'authentification
  const checkAuthStatus = () => {
    const isAuth = state.isAuthenticated;
    const hasToken = !!localStorage.getItem('token');
    const hasUser = !!state.user;
    
    console.log('[Auth Debug] Manual auth status check:', {
      isAuthenticated: isAuth,
      hasToken,
      hasUser,
      user: state.user?.name
    });
    
    // Vérifiez si l'état est incohérent
    if (hasToken && !isAuth) {
      console.warn('[Auth Debug] Inconsistent state: Token exists but not authenticated!');
    }
    
    return isAuth;
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateUserColor,
        checkAuthStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

