'use client'; 

import { useEffect } from 'react'; 
import { useRouter } from 'next/navigation'; 
import { useAuth } from '@/hooks/useAuth'; 
import { Calendar, Clock, Users, ArrowRight, Check } from 'lucide-react'; 
import Link from 'next/link'; 

export default function HomePage() { 
  const { user, isLoading } = useAuth(); 
  const router = useRouter(); 

  useEffect(() => { 
    if (!isLoading && user) { 
      router.push('/dashboard'); 
    } 
  }, [user, isLoading, router]); 

  if (isLoading || user) return null; 

  return ( 
    <div className="min-h-screen bg-white"> 
      {/* Nav */} 
      <nav className="sticky top-0 z-10 border-b border-gray-100 bg-white/80 backdrop-blur-md"> 
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> 
          <div className="flex h-16 items-center justify-between"> 
            <div className="flex items-center gap-2"> 
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-brand-600"> 
                <Calendar className="h-4 w-4 text-white" /> 
              </div> 
              <span className="text-lg font-bold text-gray-900">CalClone</span> 
            </div> 
            <div className="flex items-center gap-3"> 
              <Link href="/auth/login" className="btn-secondary text-sm"> 
                Sign in 
              </Link> 
              <Link href="/auth/register" className="btn-primary text-sm"> 
                Get started free 
              </Link> 
            </div> 
          </div> 
        </div> 
      </nav> 

      {/* Hero */} 
      <section className="mx-auto max-w-7xl px-4 py-24 text-center sm:px-6 lg:px-8"> 
        <div className="mb-8 inline-flex items-center gap-2 rounded-full border border-brand-200 bg-brand-50 px-4 py-1.5 text-xs font-medium text-brand-700"> 
          <span className="h-1.5 w-1.5 rounded-full bg-brand-500" /> 
          Open source scheduling platform 
        </div> 
        <h1 className="mb-6 text-5xl font-bold tracking-tight text-gray-900 sm:text-6xl"> 
          Scheduling infrastructure 
          <br /> 
          <span className="text-brand-600">for everyone</span> 
        </h1> 
        <p className="mx-auto mb-10 max-w-2xl text-xl text-gray-500"> 
          Share your availability, let others book meetings with you, and never 
          worry about double bookings again. 
        </p> 
        <div className="flex flex-col items-center justify-center gap-4 sm:flex-row"> 
          <Link 
            href="/auth/register" 
            className="btn-primary px-6 py-3 text-base" 
          > 
            Start for free <ArrowRight className="h-4 w-4" /> 
          </Link> 
          <Link href="/auth/login" className="btn-secondary px-6 py-3 text-base"> 
            Sign in 
          </Link> 
        </div> 
      </section> 

      {/* Features */} 
      <section className="bg-gray-50 py-24"> 
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8"> 
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-3"> 
            {[ 
              { 
                icon: <Calendar className="h-6 w-6 text-brand-600" />, 
                title: 'Event Types', 
                desc: 'Create different meeting types — 15-min intros, 60-min deep dives — each with its own shareable link.', 
              }, 
              { 
                icon: <Clock className="h-6 w-6 text-brand-600" />, 
                title: 'Smart Availability', 
                desc: 'Set your working hours once. Time slots are generated automatically based on duration and availability.', 
              }, 
              { 
                icon: <Users className="h-6 w-6 text-brand-600" />, 
                title: 'No Double Bookings', 
                desc: 'Database-level constraints ensure two guests can never book the same slot simultaneously.', 
              }, 
            ].map((f) => ( 
              <div key={f.title} className="card p-6"> 
                <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-brand-50"> 
                  {f.icon} 
                </div> 
                <h3 className="mb-2 text-lg font-semibold text-gray-900"> 
                  {f.title} 
                </h3> 
                <p className="text-sm leading-relaxed text-gray-500">{f.desc}</p> 
              </div> 
            ))} 
          </div> 
        </div> 
      </section> 

      {/* Pricing */} 
      <section className="py-24"> 
        <div className="mx-auto max-w-lg px-4 text-center sm:px-6"> 
          <h2 className="mb-4 text-3xl font-bold text-gray-900"> 
            Always free 
          </h2> 
          <p className="mb-10 text-gray-500"> 
            No credit card required. No hidden fees. 
          </p> 
          <div className="card p-8 text-left"> 
            <div className="mb-1 text-4xl font-bold text-gray-900">$0</div> 
            <div className="mb-6 text-sm text-gray-500"> 
              per month, forever 
            </div> 
            <ul className="mb-8 space-y-3"> 
              {[ 
                'Unlimited event types', 
                'Unlimited bookings', 
                'Public booking page', 
                'Availability management', 
                'Bookings dashboard', 
              ].map((item) => ( 
                <li 
                  key={item} 
                  className="flex items-center gap-2 text-sm text-gray-700" 
                > 
                  <Check className="h-4 w-4 flex-shrink-0 text-brand-600" /> 
                  {item} 
                </li> 
              ))} 
            </ul> 
            <Link 
              href="/auth/register" 
              className="btn-primary w-full justify-center py-3" 
            > 
              Get started free 
            </Link> 
          </div> 
        </div> 
      </section> 

      {/* Footer */} 
      <footer className="border-t border-gray-100 py-8"> 
        <div className="mx-auto max-w-7xl px-4 text-center text-sm text-gray-400"> 
          CalClone — Built with Next.js 14, Express, and PostgreSQL 
        </div> 
      </footer> 
    </div> 
  ); 
} 
