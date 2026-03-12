'use client'; 

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'; 
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'; 
import { useState } from 'react'; 
import { ToastProvider } from './ui/ToastProvider'; 

export function Providers({ children }: { children: React.ReactNode }) { 
  const [queryClient] = useState( 
    () => 
      new QueryClient({ 
        defaultOptions: { 
          queries: { 
            staleTime: 60 * 1000, 
            retry: 1, 
            refetchOnWindowFocus: false, 
          }, 
        }, 
      }) 
  ); 

  return ( 
    <QueryClientProvider client={queryClient}> 
      {children} 
      <ToastProvider /> 
      {process.env.NODE_ENV === 'development' && ( 
        <ReactQueryDevtools initialIsOpen={false} /> 
      )} 
    </QueryClientProvider> 
  ); 
} 
