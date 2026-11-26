'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserRole, Profile } from '@/types';

interface AuthContextType {
  user: Profile | null;
  role: UserRole;
  isLoading: boolean;
  loginAsDemoUser: (role: UserRole) => void;
  logout: () => void;
  updateUserProfile: (profile: Partial<Profile>) => void;
}

const DEMO_USERS: Record<UserRole, Profile> = {
  patient: {
    id: '00000000-0000-0000-0000-000000000004',
    email: 'patient.arun@example.com',
    full_name: 'Arun Kumar',
    role: 'patient',
    phone: '+91 9876543213',
    is_active: true,
    created_at: '2026-11-20T10:00:00.000Z',
  },
  doctor: {
    id: '00000000-0000-0000-0000-000000000002',
    email: 'dr.rajesh@aihealth.com',
    full_name: 'Dr. Rajesh Sharma, MD',
    role: 'doctor',
    phone: '+91 9876543211',
    is_active: true,
    created_at: '2026-11-20T10:00:00.000Z',
  },
  admin: {
    id: '00000000-0000-0000-0000-000000000001',
    email: 'admin@aihealth.com',
    full_name: 'System Administrator',
    role: 'admin',
    phone: '+91 9876543210',
    is_active: true,
    created_at: '2026-11-20T10:00:00.000Z',
  },
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  role: 'patient',
  isLoading: true,
  loginAsDemoUser: () => {},
  logout: () => {},
  updateUserProfile: () => {},
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check saved session in localStorage for seamless demo experience
    const saved = localStorage.getItem('ai_health_current_user');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        setUser(parsed);
      } catch {
        setUser(DEMO_USERS.patient);
      }
    } else {
      // Default to demo patient for immediate interactive testing
      setUser(DEMO_USERS.patient);
      localStorage.setItem('ai_health_current_user', JSON.stringify(DEMO_USERS.patient));
    }
    setIsLoading(false);
  }, []);

  const loginAsDemoUser = (role: UserRole) => {
    const demo = DEMO_USERS[role];
    setUser(demo);
    localStorage.setItem('ai_health_current_user', JSON.stringify(demo));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('ai_health_current_user');
  };

  const updateUserProfile = (updatedFields: Partial<Profile>) => {
    if (!user) return;
    const updated = { ...user, ...updatedFields };
    setUser(updated);
    localStorage.setItem('ai_health_current_user', JSON.stringify(updated));
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        role: user ? user.role : 'patient',
        isLoading,
        loginAsDemoUser,
        logout,
        updateUserProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
