import Link from 'next/link'; 
import { Calendar } from 'lucide-react'; 

export default function AuthLayout({ 
  children, 
}: { 
  children: React.ReactNode; 
}) { 
  return ( 
    <div className="flex min-h-screen flex-col items-center justify-center bg-gray-50 px-4 py-12"> 
      <Link href="/" className="mb-8 flex items-center gap-2"> 
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-brand-600"> 
          <Calendar className="h-5 w-5 text-white" /> 
        </div> 
        <span className="text-xl font-bold text-gray-900">CalClone</span> 
      </Link> 
      <div className="w-full max-w-sm">{children}</div> 
    </div> 
  ); 
} 
