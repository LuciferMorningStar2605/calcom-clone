import axios, { AxiosError } from 'axios'; 

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000'; 

export const apiClient = axios.create({ 
  baseURL: `${API_URL}/api`, 
  headers: { 
    'Content-Type': 'application/json', 
  }, 
  withCredentials: true, 
}); 

// Attach JWT from localStorage on every request 
apiClient.interceptors.request.use((config) => { 
  if (typeof window !== 'undefined') { 
    const token = localStorage.getItem('auth_token'); 
    if (token) { 
      config.headers.Authorization = `Bearer ${token}`; 
    } 
  } 
  return config; 
}); 

// Redirect to login on 401 
apiClient.interceptors.response.use( 
  (response) => response, 
  (error: AxiosError) => { 
    if (error.response?.status === 401) { 
      if (typeof window !== 'undefined') { 
        localStorage.removeItem('auth_token'); 
        localStorage.removeItem('auth_user'); 
        window.location.href = '/auth/login'; 
      } 
    } 
    return Promise.reject(error); 
  } 
); 

export function getErrorMessage(error: unknown): string { 
  if (axios.isAxiosError(error)) { 
    return ( 
      (error.response?.data as { error?: string })?.error || 
      error.message || 
      'Something went wrong' 
    ); 
  } 
  if (error instanceof Error) return error.message; 
  return 'Something went wrong'; 
} 
