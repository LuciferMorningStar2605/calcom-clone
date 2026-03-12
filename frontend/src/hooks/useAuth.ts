'use client'; 

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import { useRouter } from 'next/navigation'; 
import * as apiService from '@/services/apiService'; 
import type { User, LoginInput, RegisterInput } from '@/types'; 
import { getErrorMessage } from '@/services/api'; 

const USER_KEY = ['auth', 'me']; 

function getStoredToken(): string | null { 
  if (typeof window === 'undefined') return null; 
  return localStorage.getItem('auth_token'); 
} 

export function useAuth() { 
  const queryClient = useQueryClient(); 
  const router = useRouter(); 

  const { 
    data: user, 
    isLoading, 
    error, 
  } = useQuery<User | null>({ 
    queryKey: USER_KEY, 
    queryFn: async () => { 
      if (!getStoredToken()) return null; 
      return apiService.getMe(); 
    }, 
    retry: false, 
    staleTime: 5 * 60 * 1000, 
  }); 

  const loginMutation = useMutation({ 
    mutationFn: (data: LoginInput) => apiService.login(data), 
    onSuccess: ({ user, token }) => { 
      localStorage.setItem('auth_token', token); 
      queryClient.setQueryData(USER_KEY, user); 
      router.push('/dashboard'); 
    }, 
  }); 

  const registerMutation = useMutation({ 
    mutationFn: (data: RegisterInput) => apiService.register(data), 
    onSuccess: ({ user, token }) => { 
      localStorage.setItem('auth_token', token); 
      queryClient.setQueryData(USER_KEY, user); 
      router.push('/dashboard'); 
    }, 
  }); 

  const logout = () => { 
    localStorage.removeItem('auth_token'); 
    queryClient.clear(); 
    router.push('/auth/login'); 
  }; 

  return { 
    user: user ?? null, 
    isLoading, 
    error, 
    login: loginMutation.mutate, 
    loginAsync: loginMutation.mutateAsync, 
    loginError: loginMutation.error 
      ? getErrorMessage(loginMutation.error) 
      : null, 
    isLoginPending: loginMutation.isPending, 
    register: registerMutation.mutate, 
    registerAsync: registerMutation.mutateAsync, 
    registerError: registerMutation.error 
      ? getErrorMessage(registerMutation.error) 
      : null, 
    isRegisterPending: registerMutation.isPending, 
    logout, 
    isAuthenticated: !!user, 
  }; 
} 
