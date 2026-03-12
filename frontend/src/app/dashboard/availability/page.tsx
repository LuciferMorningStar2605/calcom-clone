'use client'; 

import { useState, useEffect } from 'react'; 
import { useAuth } from '@/hooks/useAuth'; 
import { useAvailability } from '@/hooks/useAvailability'; 
import { DAY_NAMES } from '@/types'; 
import { Save } from 'lucide-react'; 

interface DaySlot { 
  enabled: boolean; 
  startTime: string; 
  endTime: string; 
} 

const DEFAULT_SLOTS: DaySlot[] = DAY_NAMES.map((_, i) => ({ 
  enabled: i >= 1 && i <= 5, 
  startTime: '09:00', 
  endTime: '17:00', 
})); 

const TIME_OPTIONS: string[] = []; 
for (let h = 0; h < 24; h++) { 
  for (let m = 0; m < 60; m += 30) { 
    TIME_OPTIONS.push( 
      `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}` 
    ); 
  } 
} 

export default function AvailabilityPage() { 
  const { user } = useAuth(); 
  const { availability, isLoading, save, isSaving } = useAvailability(); 
  const [slots, setSlots] = useState<DaySlot[]>(DEFAULT_SLOTS); 
  const [timezone, setTimezone] = useState(user?.timezone || 'UTC'); 

  useEffect(() => { 
    if (availability.length > 0) { 
      const updated = DEFAULT_SLOTS.map((def, i) => { 
        const existing = availability.find((a) => a.dayOfWeek === i); 
        if (existing) { 
          return { 
            enabled: true, 
            startTime: existing.startTime, 
            endTime: existing.endTime, 
          }; 
        } 
        return { ...def, enabled: false }; 
      }); 
      setSlots(updated); 
      setTimezone(availability[0].timezone || user?.timezone || 'UTC'); 
    } 
  }, [availability, user]); 

  const handleToggle = (dayIndex: number) => { 
    setSlots((prev) => 
      prev.map((slot, i) => 
        i === dayIndex ? { ...slot, enabled: !slot.enabled } : slot 
      ) 
    ); 
  }; 

  const handleTimeChange = ( 
    dayIndex: number, 
    field: 'startTime' | 'endTime', 
    value: string 
  ) => { 
    setSlots((prev) => 
      prev.map((slot, i) => 
        i === dayIndex ? { ...slot, [field]: value } : slot 
      ) 
    ); 
  }; 

  const handleSave = async () => { 
    const enabledSlots = slots 
      .map((slot, i) => ({ 
        dayOfWeek: i, 
        startTime: slot.startTime, 
        endTime: slot.endTime, 
        timezone, 
        enabled: slot.enabled, 
      })) 
      .filter((slot) => slot.enabled) 
      .map(({ enabled: _, ...rest }) => rest); 

    await save(enabledSlots); 
  }; 

  if (isLoading) { 
    return ( 
      <div className="max-w-2xl space-y-4"> 
        {[1, 2, 3, 4, 5].map((i) => ( 
          <div key={i} className="card h-14 animate-pulse bg-gray-100" /> 
        ))} 
      </div> 
    ); 
  } 

  return ( 
    <div className="animate-fade-in max-w-2xl"> 
      <div className="mb-8 flex items-start justify-between gap-4"> 
        <div> 
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1> 
          <p className="mt-1 text-sm text-gray-500"> 
            Set when you&apos;re available for bookings. 
          </p> 
        </div> 
        <button 
          onClick={handleSave} 
          disabled={isSaving} 
          className="btn-primary flex-shrink-0" 
        > 
          <Save className="h-4 w-4" /> 
          {isSaving ? 'Saving...' : 'Save changes'} 
        </button> 
      </div> 

      {/* Timezone selector */} 
      <div className="card mb-6 p-4"> 
        <label className="label">Timezone</label> 
        <select 
          value={timezone} 
          onChange={(e) => setTimezone(e.target.value)} 
          className="input" 
        > 
          {Intl.supportedValuesOf('timeZone').map((tz) => ( 
            <option key={tz} value={tz}> 
              {tz} 
            </option> 
          ))} 
        </select> 
      </div> 

      {/* Day toggles */} 
      <div className="card divide-y divide-gray-100"> 
        {DAY_NAMES.map((day, i) => ( 
          <div 
            key={day} 
            className={`flex items-center gap-4 p-4 transition-colors ${ 
              !slots[i].enabled ? 'opacity-60' : '' 
            }`} 
          > 
            {/* Toggle switch */} 
            <button 
              onClick={() => handleToggle(i)} 
              className={`relative flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-brand-500 focus:ring-offset-2 ${ 
                slots[i].enabled ? 'bg-brand-600' : 'bg-gray-200' 
              }`} 
              role="switch" 
              aria-checked={slots[i].enabled} 
            > 
              <span 
                className={`mt-1 inline-block h-4 w-4 rounded-full bg-white shadow transition-transform ${ 
                  slots[i].enabled ? 'translate-x-6' : 'translate-x-1' 
                }`} 
              /> 
            </button> 

            <span className="w-24 flex-shrink-0 text-sm font-medium text-gray-700"> 
              {day} 
            </span> 

            {slots[i].enabled ? ( 
              <div className="flex items-center gap-2"> 
                <select 
                  value={slots[i].startTime} 
                  onChange={(e) => 
                    handleTimeChange(i, 'startTime', e.target.value) 
                  } 
                  className="input w-28 text-sm" 
                > 
                  {TIME_OPTIONS.map((t) => ( 
                    <option key={t} value={t}> 
                      {t} 
                    </option> 
                  ))} 
                </select> 
                <span className="text-sm text-gray-400">–</span> 
                <select 
                  value={slots[i].endTime} 
                  onChange={(e) => 
                    handleTimeChange(i, 'endTime', e.target.value) 
                  } 
                  className="input w-28 text-sm" 
                > 
                  {TIME_OPTIONS.filter( 
                    (t) => t > slots[i].startTime 
                  ).map((t) => ( 
                    <option key={t} value={t}> 
                      {t} 
                    </option> 
                  ))} 
                </select> 
              </div> 
            ) : ( 
              <span className="text-sm text-gray-400">Unavailable</span> 
            )} 
          </div> 
        ))} 
      </div> 
    </div> 
  ); 
} 
