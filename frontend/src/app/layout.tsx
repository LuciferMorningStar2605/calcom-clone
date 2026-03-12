import type { Metadata } from 'next'; 
import { Inter } from 'next/font/google'; 
import './globals.css'; 
import { Providers } from '@/components/Providers'; 

const inter = Inter({ 
  subsets: ['latin'], 
  variable: '--font-inter', 
  display: 'swap', 
}); 

export const metadata: Metadata = { 
  title: { 
    default: 'CalClone – Scheduling Made Simple', 
    template: '%s | CalClone', 
  }, 
  description: 
    'Simple, beautiful scheduling. Share your availability and let people book time with you.', 
}; 

export default function RootLayout({ 
  children, 
}: { 
  children: React.ReactNode; 
}) { 
  return ( 
    <html lang="en" className={inter.variable}> 
      <body> 
        <Providers>{children}</Providers> 
      </body> 
    </html> 
  ); 
} 
