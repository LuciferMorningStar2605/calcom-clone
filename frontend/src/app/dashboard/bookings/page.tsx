'use client'; 

import { useState } from 'react'; 
import { useBookings } from '@/hooks/useBookings'; 
import { BookingCard } from '@/components/dashboard/BookingCard'; 
import { EmptyState } from '@/components/ui/EmptyState'; 
import { CalendarDays } from 'lucide-react'; 

type FilterType = 'upcoming' | 'past' | 'cancelled'; 

const filters: { label: string; value: FilterType }[] = [ 
  { label: 'Upcoming', value: 'upcoming' }, 
  { label: 'Past', value: 'past' }, 
  { label: 'Cancelled', value: 'cancelled' }, 
]; 

export default function BookingsPage() { 
  const [activeFilter, setActiveFilter] = useState<FilterType>('upcoming'); 
  const { bookings, isLoading, cancel, isCancelling } = 
    useBookings(activeFilter); 

  return ( 
    <div className="animate-fade-in"> 
      <div className="mb-8"> 
        <h1 className="text-2xl font-bold text-gray-900">Bookings</h1> 
        <p className="mt-1 text-sm text-gray-500"> 
          View and manage all your scheduled meetings. 
        </p> 
      </div> 

      {/* Filter tabs */} 
      <div className="mb-6 flex w-fit gap-1 rounded-lg border border-gray-200 bg-white p-1"> 
        {filters.map((f) => ( 
          <button 
            key={f.value} 
            onClick={() => setActiveFilter(f.value)} 
            className={`rounded-md px-4 py-1.5 text-sm font-medium transition-all ${ 
              activeFilter === f.value 
                ? 'bg-brand-600 text-white shadow-sm' 
                : 'text-gray-600 hover:text-gray-900' 
            }`} 
          > 
            {f.label} 
          </button> 
        ))} 
      </div> 

      {isLoading ? ( 
        <div className="space-y-3"> 
          {[1, 2, 3].map((i) => ( 
            <div key={i} className="card h-24 animate-pulse bg-gray-100" /> 
          ))} 
        </div> 
      ) : bookings.length === 0 ? ( 
        <EmptyState 
          icon={<CalendarDays className="h-10 w-10 text-gray-400" />} 
          title={ 
            activeFilter === 'upcoming' 
              ? 'No upcoming bookings' 
              : activeFilter === 'past' 
              ? 'No past bookings' 
              : 'No cancelled bookings' 
          } 
          description={ 
            activeFilter === 'upcoming' 
              ? 'When someone books time with you, it will appear here.' 
              : 'Your booking history will appear here.' 
          } 
        /> 
      ) : ( 
        <div className="space-y-3"> 
          {bookings.map((booking) => ( 
            <BookingCard 
              key={booking.id} 
              booking={booking} 
              onCancel={ 
                activeFilter === 'upcoming' 
                  ? () => cancel(booking.id) 
                  : undefined 
              } 
              isCancelling={isCancelling} 
            /> 
          ))} 
        </div> 
      )} 
    </div> 
  ); 
} 
