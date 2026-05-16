import { createContext, useContext, useState, useCallback, useEffect, ReactNode } from 'react';
import { User } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  isAdmin: () => boolean;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>(() => {
    const saved = localStorage.getItem('barangay_auth');
    if (saved) {
      try {
        const user = JSON.parse(saved) as User;
        return { user, isAuthenticated: true, isLoading: true };
      } catch {
        return { user: null, isAuthenticated: false, isLoading: false };
      }
    }
    return { user: null, isAuthenticated: false, isLoading: false };
  });

  // Verify token on mount
  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem('auth_token');
      if (token && state.isAuthenticated) {
        try {
          const data = await api.getProfile();
          const user: User = {
            id: data.user.id,
            name: data.user.name,
            email: data.user.email,
            phone: data.user.phone,
            address: data.user.address,
            role: data.user.role,
            createdAt: data.user.createdAt,
            isVerified: data.user.isVerified,
          };
          localStorage.setItem('barangay_auth', JSON.stringify(user));
          setState({ user, isAuthenticated: true, isLoading: false });
        } catch {
          // Token invalid
          api.logout();
          setState({ user: null, isAuthenticated: false, isLoading: false });
        }
      } else {
        setState(prev => ({ ...prev, isLoading: false }));
      }
    };

    verifyToken();
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);
      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        role: data.user.role,
        createdAt: data.user.createdAt,
        isVerified: data.user.isVerified,
      };
      localStorage.setItem('barangay_auth', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Login failed' };
    }
  }, []);

  const register = useCallback(async (data: RegisterData) => {
    try {
      const result = await api.register({
        name: data.name,
        email: data.email,
        password: data.password,
        phone: data.phone,
        address: data.address,
      });
      const user: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        address: result.user.address,
        role: result.user.role,
        createdAt: result.user.createdAt,
        isVerified: result.user.isVerified,
      };
      localStorage.setItem('barangay_auth', JSON.stringify(user));
      setState({ user, isAuthenticated: true, isLoading: false });
      return { success: true };
    } catch (error: any) {
      return { success: false, error: error.message || 'Registration failed' };
    }
  }, []);

  const logout = useCallback(() => {
    api.logout();
    localStorage.removeItem('barangay_auth');
    setState({ user: null, isAuthenticated: false, isLoading: false });
  }, []);

  const isAdmin = useCallback(() => {
    return state.user?.role === 'admin' || state.user?.role === 'superadmin';
  }, [state.user]);

  return (
    <AuthContext.Provider value={{ ...state, login, register, logout, isAdmin }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
