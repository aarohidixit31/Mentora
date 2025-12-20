import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from "react";
import { authAPI } from "../services/api";

/* ============================
   TYPES
============================ */
interface User {
  _id: string;
  name: string;
  email: string;
  role: "student" | "tutor" | "freelancer" | "admin";
  avatar?: string;
  isVerified: boolean;
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
  role?: "student" | "tutor" | "freelancer";
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (userData: RegisterData) => Promise<void>;
  googleLogin: (googleToken: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => void;
  refreshToken: () => Promise<void>;
}

/* ============================
   INITIAL STATE
============================ */
const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: true,
  isAuthenticated: !!localStorage.getItem("token"),
};

/* ============================
   REDUCER
============================ */
type AuthAction =
  | { type: "AUTH_START" }
  | { type: "AUTH_SUCCESS"; payload: { user: User; token: string } }
  | { type: "AUTH_FAILURE" }
  | { type: "LOGOUT" }
  | { type: "UPDATE_USER"; payload: Partial<User> }
  | { type: "SET_LOADING"; payload: boolean };

const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case "AUTH_START":
      return { ...state, isLoading: true };

    case "AUTH_SUCCESS":
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        isLoading: false,
      };

    case "AUTH_FAILURE":
      // ❗ DO NOT delete token here
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "LOGOUT":
      return {
        user: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
      };

    case "UPDATE_USER":
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };

    case "SET_LOADING":
      return {
        ...state,
        isLoading: action.payload,
      };

    default:
      return state;
  }
};

/* ============================
   CONTEXT
============================ */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/* ============================
   PROVIDER
============================ */
export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [state, dispatch] = useReducer(authReducer, initialState);

  /* ============================
     RESTORE AUTH ON LOAD
  ============================ */
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        dispatch({ type: "SET_LOADING", payload: false });
        return;
      }

      try {
        const response = await authAPI.getProfile();

        if (response.data.success) {
          dispatch({
            type: "AUTH_SUCCESS",
            payload: {
              user: response.data.user,
              token,
            },
          });
        } else {
          dispatch({ type: "AUTH_FAILURE" });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        // ❗ DO NOT remove token here
        dispatch({ type: "AUTH_FAILURE" });
      }
    };

    checkAuth();
  }, []);

  /* ============================
     LOGIN
  ============================ */
  const login = async (email: string, password: string) => {
    dispatch({ type: "AUTH_START" });

    const response = await authAPI.login({ email, password });

    if (!response.data.success) {
      dispatch({ type: "AUTH_FAILURE" });
      throw new Error(response.data.message || "Login failed");
    }

    const { user, token } = response.data as any;
    localStorage.setItem("token", token);

    dispatch({
      type: "AUTH_SUCCESS",
      payload: { user, token },
    });
  };

  /* ============================
     REGISTER
  ============================ */
  const register = async (userData: RegisterData) => {
    dispatch({ type: "AUTH_START" });

    const response = await authAPI.register(userData);

    if (!response.data.success) {
      dispatch({ type: "AUTH_FAILURE" });
      throw new Error(response.data.message || "Registration failed");
    }

    const { user, token } = response.data as any;
    localStorage.setItem("token", token);

    dispatch({
      type: "AUTH_SUCCESS",
      payload: { user, token },
    });
  };

  /* ============================
     GOOGLE LOGIN
  ============================ */
  const googleLogin = async (googleToken: string) => {
    dispatch({ type: "AUTH_START" });

    const response = await authAPI.googleLogin({ token: googleToken });

    if (!response.data.success) {
      dispatch({ type: "AUTH_FAILURE" });
      throw new Error("Google login failed");
    }

    const { user, token } = response.data as any;
    localStorage.setItem("token", token);

    dispatch({
      type: "AUTH_SUCCESS",
      payload: { user, token },
    });
  };

  /* ============================
     LOGOUT (ONLY PLACE TOKEN IS REMOVED)
  ============================ */
  const logout = () => {
    localStorage.removeItem("token");
    dispatch({ type: "LOGOUT" });
  };

  /* ============================
     UPDATE USER
  ============================ */
  const updateUser = (userData: Partial<User>) => {
    dispatch({ type: "UPDATE_USER", payload: userData });
  };

  /* ============================
     REFRESH TOKEN
  ============================ */
  const refreshToken = async () => {
    try {
      const response = await authAPI.refreshToken();
      if (response.data.success) {
        const { token } = response.data as any;
        localStorage.setItem("token", token);

        dispatch({
          type: "AUTH_SUCCESS",
          payload: { user: state.user!, token },
        });
      }
    } catch (error) {
      console.error("Token refresh failed:", error);
      logout();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        googleLogin,
        logout,
        updateUser,
        refreshToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/* ============================
   HOOK
============================ */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
};
