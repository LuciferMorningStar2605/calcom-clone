'use client'; 

import { format, parseISO } from 'date-fns'; 
import { utcToZonedTime } from 'date-fns-tz'; 
import Link from 'next/link'; 
import { CheckCircle, Calendar, Clock, Mail, User, Globe } from 'lucide-react'; 
import type { Booking, EventType } from '@/types'; 
import { formatDuration } from '@/lib/utils'; 

interface Props { 
  booking: Booking; 
  host: { 
    name: string; 
    username: string; 
    timezone: string; 
  }; 
  eventType: EventType; 
} 

export function BookingConfirmation({ booking, host, eventType }: Props) { 
  const startDate = parseISO(booking.startTime); 
  const zonedStart = utcToZonedTime(startDate, host.timezone); 

  return ( 
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 py-12"> 
      <div className="w-full max-w-md animate-slide-up"> 
        <div className="mb-6 flex justify-center"> 
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-green-100"> 
            <CheckCircle className="h-8 w-8 text-green-600" /> 
          </div> 
        </div> 

        <div className="card overflow-hidden"> 
          <div 
            className="h-2 w-full" 
            style={{ backgroundColor: eventType.color }} 
          /> 

          <div className="p-8"> 
            <div className="mb-2 text-center"> 
              <h1 className="text-2xl font-bold text-gray-900"> 
                Booking confirmed! 
              </h1> 
              <p className="mt-1 text-sm text-gray-500"> 
                A confirmation has been sent to{' '} 
                <span className="font-medium">{booking.guestEmail}</span> 
              </p> 
            </div> 

            <div className="mt-6 space-y-3 rounded-xl bg-gray-50 p-4"> 
              <div className="flex items-center gap-3 text-sm"> 
                <Calendar className="h-4 w-4 flex-shrink-0 text-gray-400" /> 
                <span className="text-gray-700"> 
                  {format(zonedStart, 'EEEE, MMMM d, yyyy')} 
                </span> 
              </div> 
              <div className="flex items-center gap-3 text-sm"> 
                <Clock className="h-4 w-4 flex-shrink-0 text-gray-400" /> 
                <span className="text-gray-700"> 
                  {format(zonedStart, 'h:mm a')} ( 
                  {formatDuration(eventType.duration)}) 
                </span> 
              </div> 
              <div className="flex items-center gap-3 text-sm"> 
                <Globe className="h-4 w-4 flex-shrink-0 text-gray-400" /> 
                <span className="text-gray-700">{host.timezone}</span> 
              </div> 
              <div className="border-t border-gray-200 pt-3"> 
                <div className="flex items-center gap-3 text-sm"> 
                  <User className="h-4 w-4 flex-shrink-0 text-gray-400" /> 
                  <span className="text-gray-700">{booking.guestName}</span> 
                </div> 
                <div className="mt-2 flex items-center gap-3 text-sm"> 
                  <Mail className="h-4 w-4 flex-shrink-0 text-gray-400" /> 
                  <span className="text-gray-700">{booking.guestEmail}</span> 
                </div> 
              </div> 
            </div> 

            <p className="mt-4 text-center text-sm font-medium text-gray-700"> 
              {eventType.title} with{' '} 
              <span className="text-brand-600">{host.name}</span> 
            </p> 

            <div className="mt-6 flex flex-col gap-3"> 
              <Link 
                href={`/${host.username}`} 
                className="btn-secondary w-full justify-center" 
              > 
                Book another meeting 
              </Link> 
              <Link 
                href="/" 
                className="text-center text-sm text-gray-400 hover:text-gray-600" 
              > 
                Powered by CalClone 
              </Link> 
            </div> 
          </div> 
        </div> 
      </div> 
    </div> 
  ); 
} 
