import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  ReactNode
} from 'react';

import { User, BARANGAYS } from '../types';
import api from '../services/api';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login:(email:string,password:string)=>Promise<any>;

  register:(data:RegisterData)=>Promise<any>;

  logout:()=>void;

  isAdmin:()=>boolean;

  isSuperAdmin:()=>boolean;

  updateProfile:(
    data:{
      name:string;
      phone:string;
      address:string;
    }
  )=>Promise<any>;
}

interface RegisterData {
  name: string;
  email: string;
  password: string;
  phone: string;
  address: string;
  barangay: string;
}

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = 'barangay_auth';

export function AuthProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true
  });


  /**
   * Verify token + sync user with backend
   */
  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('auth_token');

      if (!token) {
        setState({ user: null, isAuthenticated: false, isLoading: false });
        return;
      }

      try {
        // Try fetching fresh user profile from backend
        const data = await api.getProfile();

        const user: User = {
          id: String(data.user.id),
          name: data.user.name,
          email: data.user.email,
          phone: data.user.phone,
          address: data.user.address,
          barangay: data.user.barangay || BARANGAYS[0],
          role: data.user.role,
          createdAt: data.user.createdAt,
          isVerified: data.user.isVerified
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

        setState({
          user,
          isAuthenticated: true,
          isLoading: false
        });
      } catch (err) {
        // Token invalid → force logout cleanup
        api.logout();
        localStorage.removeItem(STORAGE_KEY);
        localStorage.removeItem('auth_token');

        setState({
          user: null,
          isAuthenticated: false,
          isLoading: false
        });
      }
    };

    initAuth();
  }, []);

  /**
   * LOGIN
   */
  const login = useCallback(async (email: string, password: string) => {
    try {
      const data = await api.login(email, password);

      const user: User = {
        id: data.user.id,
        name: data.user.name,
        email: data.user.email,
        phone: data.user.phone,
        address: data.user.address,
        barangay: data.user.barangay || BARANGAYS[0],
        role: data.user.role,
        createdAt: data.user.createdAt,
        isVerified: data.user.isVerified
      };

      localStorage.setItem('auth_token', data.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Login failed'
      };
    }
  }, []);

  /**
   * REGISTER
   */
  const register = useCallback(async (data: RegisterData) => {
    try {
      const result = await api.register(data);

      const user: User = {
        id: result.user.id,
        name: result.user.name,
        email: result.user.email,
        phone: result.user.phone,
        address: result.user.address,
        barangay: result.user.barangay || BARANGAYS[0],
        role: result.user.role,
        createdAt: result.user.createdAt,
        isVerified: result.user.isVerified
      };

      localStorage.setItem('auth_token', result.token);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));

      setState({
        user,
        isAuthenticated: true,
        isLoading: false
      });

      return { success: true };
    } catch (error: any) {
      return {
        success: false,
        error: error?.message || 'Registration failed'
      };
    }
  }, []);

  /**
   * LOGOUT
   */
  const logout = useCallback(() => {
    api.logout();
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem('auth_token');

    setState({
      user: null,
      isAuthenticated: false,
      isLoading: false
    });
  }, []);

  /**
   * PROFILE UPDATE
   */
  const updateProfile = useCallback(
    async (data: { name: string; phone: string; address: string }) => {
      if (!state.user) {
        return {
          success: false,
          error: 'No authenticated user found',
        };
      }

      try {
        const result = await api.updateProfile(data);

        const updatedUser: User = {
          id: String(result.user.id),
          name: result.user.name,
          email: result.user.email,
          phone: result.user.phone,
          address: result.user.address,
          barangay: result.user.barangay || BARANGAYS[0],
          role: result.user.role,
          createdAt: result.user.createdAt,
          isVerified: result.user.isVerified,
        };

        localStorage.setItem(STORAGE_KEY, JSON.stringify(updatedUser));

        setState((prevState) => ({
          ...prevState,
          user: updatedUser,
          isAuthenticated: true,
          isLoading: false,
        }));

        return { success: true, user: updatedUser };
      } catch (error: any) {
        return {
          success: false,
          error: error?.message || 'Update failed',
        };
      }
    },
    [state.user]
  );

  /**
   * ADMIN CHECK
   */
  const isAdmin = useCallback(() => {
    return (
      state.user?.role === 'admin' ||
      state.user?.role === 'superadmin'
    );
  }, [state.user]);

  const isSuperAdmin = useCallback(() => {
    return state.user?.role === 'superadmin';
  }, [state.user]);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register,
        logout,
        updateProfile,
        isAdmin,
        isSuperAdmin
      }}
    >
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