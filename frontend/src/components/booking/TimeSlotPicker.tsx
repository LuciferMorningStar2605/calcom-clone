'use client'; 

import { format, parseISO } from 'date-fns'; 
import { utcToZonedTime } from 'date-fns-tz'; 
import type { TimeSlot } from '@/types'; 
import { Clock } from 'lucide-react'; 

interface Props { 
  date: Date; 
  slots: TimeSlot[]; 
  timezone: string; 
  isLoading: boolean; 
  onSlotSelect: (startTime: string) => void; 
  selectedSlot: string | null; 
} 

export function TimeSlotPicker({ 
  date, 
  slots, 
  timezone, 
  isLoading, 
  onSlotSelect, 
  selectedSlot, 
}: Props) { 
  const availableSlots = slots.filter((s) => s.available); 

  const formatSlotTime = (isoString: string) => { 
    try { 
      const zonedDate = utcToZonedTime(parseISO(isoString), timezone); 
      return format(zonedDate, 'h:mm a'); 
    } catch { 
      return format(parseISO(isoString), 'h:mm a'); 
    } 
  }; 

  return ( 
    <div> 
      <h2 className="mb-1 text-lg font-semibold text-gray-900"> 
        {format(date, 'EEEE, MMMM d')} 
      </h2> 
      <p className="mb-6 text-sm text-gray-500">{timezone}</p> 

      {isLoading ? ( 
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3"> 
          {Array.from({ length: 8 }).map((_, i) => ( 
            <div 
              key={i} 
              className="h-10 animate-pulse rounded-lg bg-gray-100" 
            /> 
          ))} 
        </div> 
      ) : availableSlots.length === 0 ? ( 
        <div className="flex flex-col items-center justify-center py-12 text-center"> 
          <Clock className="mb-3 h-10 w-10 text-gray-300" /> 
          <p className="font-medium text-gray-500">No available slots</p> 
          <p className="mt-1 text-sm text-gray-400"> 
            All time slots for this day are booked or in the past. 
          </p> 
        </div> 
      ) : ( 
        <div className="grid grid-cols-2 gap-2 sm:grid-cols-3"> 
          {availableSlots.map((slot) => { 
            const isSelected = selectedSlot === slot.startTime; 
            return ( 
              <button 
                key={slot.startTime} 
                onClick={() => onSlotSelect(slot.startTime)} 
                className={[ 
                  'rounded-lg border py-2.5 text-sm font-medium transition-all hover:scale-[1.02] active:scale-[0.98]', 
                  isSelected 
                    ? 'border-brand-600 bg-brand-600 text-white shadow-sm' 
                    : 'border-gray-200 bg-white text-gray-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700', 
                ].join(' ')} 
              > 
                {formatSlotTime(slot.startTime)} 
              </button> 
            ); 
          })} 
        </div> 
      )} 
    </div> 
  ); 
} 
