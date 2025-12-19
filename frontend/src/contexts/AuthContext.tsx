import React, { createContext, useContext, useReducer, useEffect, ReactNode } from 'react';
import { authAPI } from '../services/api';

// Types
interface User {
  _id: string;
  name: string;
  email: string;
  role: 'student' | 'tutor' | 'freelancer' | 'admin';
  avatar?: string;
  isVerified: boolean;
  isApproved: boolean;
  xp: number;
  level: number;
  profileCompletion?: number;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'tutor' | 'freelancer';
}

// Action types
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

// Initial state
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

// Reducer
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return {
        ...state,
        isLoading: true,
      };
    case 'AUTH_SUCCESS':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isLoading: false,
        isAuthenticated: true,
      };
    case 'AUTH_FAILURE':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        token: null,
        isLoading: false,
        isAuthenticated: false,
      };
    case 'UPDATE_USER':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: action.payload,
      };
    default:
      return state;
  }
};

// Create context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Provider component
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // Check if user is authenticated on app load
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('token');
      
      if (!token) {
        dispatch({ type: 'SET_LOADING', payload: false });
        return;
      }

      try {
        const response = await authAPI.getProfile();
        if (response.data.success) {
          dispatch({
            type: 'AUTH_SUCCESS',
            payload: {
              user: response.data.data.user,
              token,
            },
          });
        } else {
          localStorage.removeItem('token');
          dispatch({ type: 'AUTH_FAILURE' });
        }
      } catch (error) {
        console.error('Auth check failed:', error);
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_FAILURE' });
      }
    };

    checkAuth();
  }, []);

  // Login function
  const login = async (email: string, password: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.login({ email, password });
      
      if (response.data.success) {
        const { user, token } = response.data as any;
        
        localStorage.setItem('token', token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error(response.data.message || 'Login failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error(error.response?.data?.message || 'Login failed');
    }
  };

  // Register function
  const register = async (userData: RegisterData): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.register(userData);
      
      if (response.data.success) {
        const { user, token } = response.data as any;
        
        localStorage.setItem('token', token);
        
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error(response.data.message || 'Registration failed');
      }
    } catch (error: any) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error(error.response?.data?.message || 'Registration failed');
    }
  };

  // Logout function
  const logout = (): void => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // Update user function
  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // Refresh token function
  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authAPI.refreshToken();
      
      if (response.data.success) {
        const { token } = response.data.data;
        localStorage.setItem('token', token);
        
        // Update token in state if needed
        dispatch({
          type: 'AUTH_SUCCESS',
          payload: {
            user: state.user!,
            token,
          },
        });
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      logout();
    }
  };

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateUser,
    refreshToken,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook to use auth context
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  
  return context;
};