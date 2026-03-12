'use client'; 

import { useEffect, useState } from 'react'; 
import { useRouter, usePathname } from 'next/navigation'; 
import Link from 'next/link'; 
import { useAuth } from '@/hooks/useAuth'; 
import { getInitials } from '@/lib/utils'; 
import { 
  Calendar, 
  Clock, 
  CalendarDays, 
  Settings, 
  LogOut, 
  Menu, 
  X, 
  ExternalLink, 
} from 'lucide-react'; 

const navItems = [ 
  { href: '/dashboard', label: 'Event Types', icon: Calendar, exact: true }, 
  { href: '/dashboard/bookings', label: 'Bookings', icon: CalendarDays }, 
  { href: '/dashboard/availability', label: 'Availability', icon: Clock }, 
  { href: '/dashboard/settings', label: 'Settings', icon: Settings }, 
]; 

export default function DashboardLayout({ 
  children, 
}: { 
  children: React.ReactNode; 
}) { 
  const { user, isLoading, logout, isAuthenticated } = useAuth(); 
  const router = useRouter(); 
  const pathname = usePathname(); 
  const [sidebarOpen, setSidebarOpen] = useState(false); 

  useEffect(() => { 
    if (!isLoading && !isAuthenticated) { 
      router.push('/auth/login'); 
    } 
  }, [isLoading, isAuthenticated, router]); 

  if (isLoading || !user) { 
    return ( 
      <div className="flex min-h-screen items-center justify-center"> 
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" /> 
      </div> 
    ); 
  } 

  const isActive = (href: string, exact?: boolean) => { 
    if (exact) return pathname === href; 
    return pathname.startsWith(href); 
  }; 

  return ( 
    <div className="flex min-h-screen bg-gray-50"> 
      {/* Mobile overlay */} 
      {sidebarOpen && ( 
        <div 
          className="fixed inset-0 z-20 bg-black/50 lg:hidden" 
          onClick={() => setSidebarOpen(false)} 
        /> 
      )} 

      {/* Sidebar */} 
      <aside 
        className={`fixed inset-y-0 left-0 z-30 flex w-64 flex-col border-r border-gray-200 bg-white transition-transform lg:relative lg:translate-x-0 ${ 
          sidebarOpen ? 'translate-x-0' : '-translate-x-full' 
        }`} 
      > 
        <div className="flex h-16 items-center gap-2 border-b border-gray-100 px-6"> 
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600"> 
            <Calendar className="h-4 w-4 text-white" /> 
          </div> 
          <span className="text-lg font-bold text-gray-900">CalClone</span> 
          <button 
            onClick={() => setSidebarOpen(false)} 
            className="ml-auto rounded-lg p-1 text-gray-400 hover:bg-gray-100 lg:hidden" 
          > 
            <X className="h-5 w-5" /> 
          </button> 
        </div> 

        <nav className="flex-1 space-y-1 overflow-y-auto px-4 py-4"> 
          {navItems.map((item) => { 
            const Icon = item.icon; 
            const active = isActive(item.href, item.exact); 
            return ( 
              <Link 
                key={item.href} 
                href={item.href} 
                onClick={() => setSidebarOpen(false)} 
                className={active ? 'sidebar-link-active' : 'sidebar-link'} 
              > 
                <Icon className="h-4 w-4 flex-shrink-0" /> 
                {item.label} 
              </Link> 
            ); 
          })} 

          <div className="pt-2"> 
            <a
              href={`/${user.username}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="sidebar-link" 
            > 
              <ExternalLink className="h-4 w-4 flex-shrink-0" /> 
              View public page 
            </a> 
          </div> 
        </nav> 

        <div className="border-t border-gray-100 p-4"> 
          <div className="flex items-center gap-3 rounded-lg p-2"> 
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-brand-100 text-sm font-semibold text-brand-700"> 
              {getInitials(user.name)} 
            </div> 
            <div className="min-w-0 flex-1"> 
              <p className="truncate text-sm font-medium text-gray-900"> 
                {user.name} 
              </p> 
              <p className="truncate text-xs text-gray-500">{user.email}</p> 
            </div> 
            <button 
              onClick={logout} 
              className="rounded-lg p-1.5 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" 
              title="Sign out" 
            > 
              <LogOut className="h-4 w-4" /> 
            </button> 
          </div> 
        </div> 
      </aside> 

      {/* Main content */} 
      <div className="flex min-w-0 flex-1 flex-col"> 
        {/* Mobile header */} 
        <header className="flex h-16 items-center gap-4 border-b border-gray-200 bg-white px-4 lg:hidden"> 
          <button 
            onClick={() => setSidebarOpen(true)} 
            className="rounded-lg p-2 text-gray-500 hover:bg-gray-100" 
          > 
            <Menu className="h-5 w-5" /> 
          </button> 
          <div className="flex items-center gap-2"> 
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-brand-600"> 
              <Calendar className="h-3.5 w-3.5 text-white" /> 
            </div> 
            <span className="font-bold text-gray-900">CalClone</span> 
          </div> 
        </header> 

        <main className="flex-1 overflow-auto p-6 lg:p-8">{children}</main> 
      </div> 
    </div> 
  ); 
} 
