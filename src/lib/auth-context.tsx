'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import {
  User,
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
} from 'firebase/auth';
import { auth } from './firebase';
import { UserRole, getUserRole, getUserInfo, UserWithRole } from './user-roles';

interface AuthContextType {
  user: User | null;
  userRole: UserRole;
  userInfo: UserWithRole | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole>('guest');
  const [userInfo, setUserInfo] = useState<UserWithRole | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);

      if (user && user.email) {
        const role = getUserRole(user.email);
        const info = getUserInfo(user.email);
        setUserRole(role);
        setUserInfo(info);
      } else {
        setUserRole('guest');
        setUserInfo(null);
      }

      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
    } catch (error: any) {
      console.error('Sign in error:', error);
      throw error;
    }
  };



  const logout = async () => {
    try {
      await signOut(auth);
    } catch (error: any) {
      console.error('Logout error:', error);
      throw error;
    }
  };

  const value = {
    user,
    userRole,
    userInfo,
    loading,
    signIn,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
} 