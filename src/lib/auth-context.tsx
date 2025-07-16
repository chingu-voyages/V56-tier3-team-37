'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
// Firebase imports - COMMENTED OUT FOR SKELETON
// import { User, onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth } from './firebase';

// Mock User type for skeleton
interface User {
  email: string;
  uid: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Firebase auth state listener - COMMENTED OUT FOR SKELETON
    /*
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
    */
    
    // Mock authentication for skeleton app
    setTimeout(() => {
      setLoading(false);
      // Uncomment the line below to simulate a logged-in user
      // setUser({ email: 'demo@example.com', uid: 'demo-uid' });
    }, 1000);
  }, []);

  const signIn = async (email: string, password: string) => {
    // Firebase sign in - COMMENTED OUT FOR SKELETON
    /*
    await signInWithEmailAndPassword(auth, email, password);
    */
    
    // Mock sign in for skeleton app
    console.log('Mock sign in:', email, password);
    setUser({ email, uid: 'mock-uid' });
  };

  const signUp = async (email: string, password: string) => {
    // Firebase sign up - COMMENTED OUT FOR SKELETON
    /*
    await createUserWithEmailAndPassword(auth, email, password);
    */
    
    // Mock sign up for skeleton app
    console.log('Mock sign up:', email, password);
    setUser({ email, uid: 'mock-uid' });
  };

  const logout = async () => {
    // Firebase sign out - COMMENTED OUT FOR SKELETON
    /*
    await signOut(auth);
    */
    
    // Mock logout for skeleton app
    console.log('Mock logout');
    setUser(null);
  };

  const value = {
    user,
    loading,
    signIn,
    signUp,
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