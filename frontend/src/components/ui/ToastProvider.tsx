'use client'; 

import { Toaster } from 'react-hot-toast'; 

export function ToastProvider() { 
  return ( 
    <Toaster 
      position="bottom-right" 
      toastOptions={{ 
        duration: 4000, 
        style: { 
          borderRadius: '10px', 
          background: '#1f2937', 
          color: '#f9fafb', 
          fontSize: '14px', 
          padding: '12px 16px', 
        }, 
        success: { 
          iconTheme: { primary: '#6366f1', secondary: '#fff' }, 
        }, 
      }} 
    /> 
  ); 
} 
