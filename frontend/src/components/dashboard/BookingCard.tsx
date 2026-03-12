'use client'; 

import { useState } from 'react'; 
import { format, parseISO } from 'date-fns'; 
import type { Booking } from '@/types'; 
import { Clock, Mail, User, MessageSquare, X } from 'lucide-react'; 
import { formatDuration } from '@/lib/utils'; 

interface Props { 
  booking: Booking; 
  onCancel?: () => Promise<void>; 
  isCancelling?: boolean; 
} 

const statusConfig = { 
  CONFIRMED: { label: 'Confirmed', className: 'bg-green-100 text-green-700' }, 
  CANCELLED: { label: 'Cancelled', className: 'bg-red-100 text-red-700' }, 
  COMPLETED: { label: 'Completed', className: 'bg-gray-100 text-gray-600' }, 
}; 

export function BookingCard({ booking, onCancel, isCancelling }: Props) { 
  const [confirmCancel, setConfirmCancel] = useState(false); 
  const status = statusConfig[booking.status]; 
  const startDate = parseISO(booking.startTime); 

  const handleCancel = async () => { 
    if (!confirmCancel) { 
      setConfirmCancel(true); 
      return; 
    } 
    await onCancel?.(); 
    setConfirmCancel(false); 
  }; 

  return ( 
    <div className="card p-5 animate-fade-in"> 
      <div className="flex items-start gap-4"> 
        <div 
          className="mt-1 h-3 w-3 flex-shrink-0 rounded-full" 
          style={{ backgroundColor: booking.eventType?.color || '#6366f1' }} 
        /> 

        <div className="flex-1 min-w-0"> 
          <div className="flex items-start justify-between gap-4"> 
            <div> 
              <h3 className="font-semibold text-gray-900"> 
                {booking.eventType?.title || 'Meeting'} 
              </h3> 
              <p className="mt-0.5 text-sm text-gray-500"> 
                {format(startDate, 'EEEE, MMMM d, yyyy')} at{' '} 
                {format(startDate, 'h:mm a')} 
              </p> 
            </div> 
            <span className={`badge flex-shrink-0 ${status.className}`}> 
              {status.label} 
            </span> 
          </div> 

          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1"> 
            <div className="flex items-center gap-1.5 text-sm text-gray-600"> 
              <User className="h-3.5 w-3.5 text-gray-400" /> 
              {booking.guestName} 
            </div> 
            <div className="flex items-center gap-1.5 text-sm text-gray-600"> 
              <Mail className="h-3.5 w-3.5 text-gray-400" /> 
              {booking.guestEmail} 
            </div> 
            {booking.eventType?.duration && ( 
              <div className="flex items-center gap-1.5 text-sm text-gray-600"> 
                <Clock className="h-3.5 w-3.5 text-gray-400" /> 
                {formatDuration(booking.eventType.duration)} 
              </div> 
            )} 
          </div> 

          {booking.notes && ( 
            <div className="mt-2 flex items-start gap-1.5 text-sm text-gray-500"> 
              <MessageSquare className="mt-0.5 h-3.5 w-3.5 flex-shrink-0 text-gray-400" /> 
              <span className="italic">{booking.notes}</span> 
            </div> 
          )} 
        </div> 
      </div> 

      {onCancel && booking.status === 'CONFIRMED' && ( 
        <div className="mt-4 flex justify-end gap-2 border-t border-gray-100 pt-3"> 
          {confirmCancel ? ( 
            <> 
              <button 
                onClick={() => setConfirmCancel(false)} 
                className="btn-secondary text-xs py-1.5" 
              > 
                Keep booking 
              </button> 
              <button 
                onClick={handleCancel} 
                disabled={isCancelling} 
                className="btn-danger text-xs py-1.5" 
              > 
                {isCancelling ? 'Cancelling...' : 'Yes, cancel'} 
              </button> 
            </> 
          ) : ( 
            <button 
              onClick={handleCancel} 
              className="text-xs text-gray-500 hover:text-red-600 transition-colors flex items-center gap-1" 
            > 
              <X className="h-3.5 w-3.5" /> 
              Cancel booking 
            </button> 
          )} 
        </div> 
      )} 
    </div> 
  ); 
} 
