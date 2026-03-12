'use client'; 

import { useEffect } from 'react'; 
import { X } from 'lucide-react'; 

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  title: string; 
  children: React.ReactNode; 
} 

export function Modal({ isOpen, onClose, title, children }: Props) { 
  useEffect(() => { 
    const handleKey = (e: KeyboardEvent) => { 
      if (e.key === 'Escape') onClose(); 
    }; 
    if (isOpen) { 
      document.addEventListener('keydown', handleKey); 
      document.body.style.overflow = 'hidden'; 
    } 
    return () => { 
      document.removeEventListener('keydown', handleKey); 
      document.body.style.overflow = ''; 
    }; 
  }, [isOpen, onClose]); 

  if (!isOpen) return null; 

  return ( 
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"> 
      <div 
        className="absolute inset-0 bg-black/50 backdrop-blur-sm animate-fade-in" 
        onClick={onClose} 
      /> 
      <div className="relative w-full max-w-md animate-slide-up rounded-2xl bg-white shadow-modal"> 
        <div className="flex items-center justify-between border-b border-gray-100 px-6 py-4"> 
          <h2 className="text-lg font-semibold text-gray-900">{title}</h2> 
          <button 
            onClick={onClose} 
            className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" 
          > 
            <X className="h-5 w-5" /> 
          </button> 
        </div> 
        <div className="px-6 py-5">{children}</div> 
      </div> 
    </div> 
  ); 
} 
