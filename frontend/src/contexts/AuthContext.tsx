import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { authAPI } from '../services/api';

// ============================
// TYPES
// ============================
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

interface RegisterData {
  name: string;
  email: string;
  password: string;
  role?: 'student' | 'tutor' | 'freelancer';
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
}

// ============================
// ACTION TYPES
// ============================
type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_USER'; payload: Partial<User> }
  | { type: 'SET_LOADING'; payload: boolean };

// ============================
// INITIAL STATE
// ============================
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isLoading: true,
  isAuthenticated: false,
};

// ============================
// REDUCER
// ============================
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true };

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
        user: state.user
          ? { ...state.user, ...action.payload }
          : null,
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

// ============================
// CONTEXT
// ============================
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// ============================
// PROVIDER
// ============================
interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  // ============================
  // CHECK AUTH ON LOAD
  // ============================
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
              user: response.data.user,
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

  // ============================
  // LOGIN (LOCAL)
  // ============================
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

  // ============================
  // REGISTER (LOCAL)
  // ============================
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
      throw new Error(
        error.response?.data?.message || 'Registration failed'
      );
    }
  };

  // ============================
  // GOOGLE LOGIN  ✅ NEW
  // ============================
  const googleLogin = async (googleToken: string): Promise<void> => {
    dispatch({ type: 'AUTH_START' });

    try {
      const response = await authAPI.googleLogin({ token: googleToken });

      if (response.data.success) {
        const { user, token } = response.data as any;
        localStorage.setItem('token', token);

        dispatch({
          type: 'AUTH_SUCCESS',
          payload: { user, token },
        });
      } else {
        throw new Error('Google login failed');
      }
    } catch (error) {
      dispatch({ type: 'AUTH_FAILURE' });
      throw new Error('Google login failed');
    }
  };

  // ============================
  // LOGOUT
  // ============================
  const logout = (): void => {
    localStorage.removeItem('token');
    dispatch({ type: 'LOGOUT' });
  };

  // ============================
  // UPDATE USER
  // ============================
  const updateUser = (userData: Partial<User>): void => {
    dispatch({ type: 'UPDATE_USER', payload: userData });
  };

  // ============================
  // REFRESH TOKEN
  // ============================
  const refreshToken = async (): Promise<void> => {
    try {
      const response = await authAPI.refreshToken();
      if (response.data.success) {
        const { token } = response.data as any;
        localStorage.setItem('token', token);

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

  // ============================
  // CONTEXT VALUE
  // ============================
  const value: AuthContextType = {
    ...state,
    login,
    register,
    googleLogin,
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

// ============================
// HOOK
// ============================
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};
