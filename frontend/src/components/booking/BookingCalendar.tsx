'use client'; 

import { useState } from 'react'; 
import { 
  format, 
  startOfMonth, 
  endOfMonth, 
  startOfWeek, 
  endOfWeek, 
  addDays, 
  addMonths, 
  subMonths, 
  isSameMonth, 
  isSameDay, 
  isToday, 
  getDay, 
  startOfDay, 
} from 'date-fns'; 
import { ChevronLeft, ChevronRight } from 'lucide-react'; 

interface Props { 
  availableDays: number[]; 
  onDateSelect: (date: Date) => void; 
  selectedDate: Date | null; 
} 

const WEEKDAY_HEADERS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; 

export function BookingCalendar({ 
  availableDays, 
  onDateSelect, 
  selectedDate, 
}: Props) { 
  const [currentMonth, setCurrentMonth] = useState(startOfMonth(new Date())); 

  const monthStart = startOfMonth(currentMonth); 
  const monthEnd = endOfMonth(currentMonth); 
  const calStart = startOfWeek(monthStart); 
  const calEnd = endOfWeek(monthEnd); 

  // Build the calendar grid rows 
  const rows: Date[][] = []; 
  let current = calStart; 
  while (current <= calEnd) { 
    const week: Date[] = []; 
    for (let i = 0; i < 7; i++) { 
      week.push(current); 
      current = addDays(current, 1); 
    } 
    rows.push(week); 
  } 

  const isAvailable = (date: Date) => { 
    const sod = startOfDay(date); 
    const today = startOfDay(new Date()); 
    if (sod < today) return false; 
    if (!isSameMonth(date, currentMonth)) return false; 
    return availableDays.includes(getDay(date)); 
  }; 

  const isPrevDisabled = isSameMonth(currentMonth, new Date()); 

  return ( 
    <div> 
      <h2 className="mb-6 text-lg font-semibold text-gray-900"> 
        Select a date 
      </h2> 

      <div className="mb-4 flex items-center justify-between"> 
        <button 
          onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} 
          disabled={isPrevDisabled} 
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600 disabled:cursor-not-allowed disabled:opacity-40" 
        > 
          <ChevronLeft className="h-5 w-5" /> 
        </button> 
        <h3 className="text-base font-semibold text-gray-900"> 
          {format(currentMonth, 'MMMM yyyy')} 
        </h3> 
        <button 
          onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} 
          className="rounded-lg p-2 text-gray-400 transition-colors hover:bg-gray-100 hover:text-gray-600" 
        > 
          <ChevronRight className="h-5 w-5" /> 
        </button> 
      </div> 

      <div className="mb-2 grid grid-cols-7 text-center"> 
        {WEEKDAY_HEADERS.map((day) => ( 
          <div key={day} className="py-1.5 text-xs font-medium text-gray-400"> 
            {day} 
          </div> 
        ))} 
      </div> 

      <div className="space-y-1"> 
        {rows.map((week, wi) => ( 
          <div key={wi} className="grid grid-cols-7 gap-1"> 
            {week.map((date, di) => { 
              const available = isAvailable(date); 
              const selected = selectedDate 
                ? isSameDay(date, selectedDate) 
                : false; 
              const isCurrentMonth = isSameMonth(date, currentMonth); 
              const todayDate = isToday(date); 

              return ( 
                <button 
                  key={di} 
                  onClick={() => available && onDateSelect(date)} 
                  disabled={!available} 
                  className={[ 
                    'aspect-square w-full rounded-lg text-sm font-medium transition-all', 
                    !isCurrentMonth ? 'invisible' : '', 
                    selected 
                      ? 'bg-brand-600 text-white shadow-sm' 
                      : available 
                      ? 'text-gray-900 hover:bg-brand-50 hover:text-brand-700' 
                      : 'cursor-not-allowed text-gray-300', 
                    todayDate && !selected ? 'ring-2 ring-brand-200' : '', 
                  ] 
                    .filter(Boolean) 
                    .join(' ')} 
                > 
                  {format(date, 'd')} 
                </button> 
              ); 
            })} 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
} 
