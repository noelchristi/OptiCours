import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/router';
import { auth, User } from '../services/api';

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      auth.getProfile()
        .then((data) => {
          setUser(data);
        })
        .catch(() => {
          localStorage.removeItem('token');
        })
        .finally(() => {
          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    try {
      const { user, token } = await auth.login({ email, password });
      localStorage.setItem('token', token);
      setUser(user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }, [router]);

  const register = useCallback(async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    institution: string;
    department?: string;
  }) => {
    try {
      const { user, token } = await auth.register(data);
      localStorage.setItem('token', token);
      setUser(user);
      router.push('/dashboard');
      return { success: true };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Une erreur est survenue',
      };
    }
  }, [router]);

  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/login');
  }, [router]);

  return {
    user,
    loading,
    login,
    register,
    logout,
  };
} 