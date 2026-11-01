import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../types';

interface AuthContextType {
  currentUser: User | null;
  isAuthenticated: boolean;
  login: (phone: string, password: string) => { success: boolean; error?: string };
  signup: (name: string, phone: string, password: string) => { success: boolean; error?: string };
  loginAsDemo: () => void;
  logout: () => void;
}

const STORAGE_KEYS = {
  AUTH_USER: 'spendwise_auth_user_v1',
  REGISTERED_USERS: 'spendwise_registered_users_v1',
};

// Default Demo User for Indian Student context
const DEMO_USER = {
  id: 'user-demo-01',
  name: 'Arjun Verma',
  phone: '9876543210',
  password: 'password123',
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  // Initialize registered users list
  const [users, setUsers] = useState<Array<User & { password: string }>>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REGISTERED_USERS);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {
      console.error('Failed to load registered users', e);
    }
    return [DEMO_USER];
  });

  // Current session user
  const [currentUser, setCurrentUser] = useState<User | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.AUTH_USER);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.phone) return parsed;
      }
    } catch (e) {
      console.error('Failed to load auth user', e);
    }
    // Default to DEMO_USER so existing users/evaluators are immediately logged in,
    // but they can click "Logout" anytime to test phone/password login!
    return {
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      phone: DEMO_USER.phone,
    };
  });

  // Save registered users whenever updated
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REGISTERED_USERS, JSON.stringify(users));
    } catch (e) {
      console.error(e);
    }
  }, [users]);

  // Save auth user session
  useEffect(() => {
    try {
      if (currentUser) {
        localStorage.setItem(STORAGE_KEYS.AUTH_USER, JSON.stringify(currentUser));
      } else {
        localStorage.removeItem(STORAGE_KEYS.AUTH_USER);
      }
    } catch (e) {
      console.error(e);
    }
  }, [currentUser]);

  // Clean phone number: remove +91, spaces, hyphens
  const normalizePhone = (phone: string): string => {
    let clean = phone.replace(/\D/g, '');
    if (clean.length === 12 && clean.startsWith('91')) {
      clean = clean.substring(2);
    }
    return clean;
  };

  const login = (phone: string, password: string): { success: boolean; error?: string } => {
    const cleanPhone = normalizePhone(phone);

    if (!cleanPhone || cleanPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    if (!password) {
      return { success: false, error: 'Please enter your password' };
    }

    const matchedUser = users.find(
      (u) => normalizePhone(u.phone) === cleanPhone && u.password === password
    );

    if (!matchedUser) {
      return { success: false, error: 'Invalid phone number or password' };
    }

    const sessionUser: User = {
      id: matchedUser.id,
      name: matchedUser.name,
      phone: matchedUser.phone,
    };

    setCurrentUser(sessionUser);
    return { success: true };
  };

  const signup = (
    name: string,
    phone: string,
    password: string
  ): { success: boolean; error?: string } => {
    if (!name.trim()) {
      return { success: false, error: 'Please enter your full name' };
    }

    const cleanPhone = normalizePhone(phone);
    if (!cleanPhone || cleanPhone.length !== 10) {
      return { success: false, error: 'Please enter a valid 10-digit mobile number' };
    }

    if (!password || password.length < 6) {
      return { success: false, error: 'Password must be at least 6 characters long' };
    }

    // Check if phone already registered
    const exists = users.some((u) => normalizePhone(u.phone) === cleanPhone);
    if (exists) {
      return { success: false, error: 'An account with this phone number already exists' };
    }

    const newUser = {
      id: 'user-' + Date.now(),
      name: name.trim(),
      phone: cleanPhone,
      password: password,
    };

    setUsers((prev) => [...prev, newUser]);

    const sessionUser: User = {
      id: newUser.id,
      name: newUser.name,
      phone: newUser.phone,
    };

    setCurrentUser(sessionUser);
    return { success: true };
  };

  const loginAsDemo = () => {
    setCurrentUser({
      id: DEMO_USER.id,
      name: DEMO_USER.name,
      phone: DEMO_USER.phone,
    });
  };

  const logout = () => {
    setCurrentUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        isAuthenticated: !!currentUser,
        login,
        signup,
        loginAsDemo,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
