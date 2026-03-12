import { 
  parseISO, 
  addMinutes, 
  isBefore, 
  isEqual, 
  setHours, 
  setMinutes, 
  startOfDay, 
  isAfter, 
} from 'date-fns'; 
import { zonedTimeToUtc } from 'date-fns-tz'; 

export interface TimeSlot { 
  startTime: string; 
  endTime: string; 
  available: boolean; 
} 

interface GenerateSlotsParams { 
  date: string;           // YYYY-MM-DD 
  startTime: string;      // "HH:MM" 
  endTime: string;        // "HH:MM" 
  duration: number;       // minutes 
  timezone: string; 
  bookedSlots: { startTime: Date; endTime: Date }[]; 
} 

/** 
 * Generate available time slots for a given date. 
 * 
 * Algorithm: 
 * 1. Parse availability start/end times in the user's timezone 
 * 2. Convert to UTC for consistent comparison 
 * 3. Walk from start → end in `duration` increments 
 * 4. Skip past slots (before now) 
 * 5. Mark slots as unavailable if they overlap with existing bookings 
 */ 
export function generateTimeSlots({ 
  date, 
  startTime, 
  endTime, 
  duration, 
  timezone, 
  bookedSlots, 
}: GenerateSlotsParams): TimeSlot[] { 
  const slots: TimeSlot[] = []; 

  const [startHour, startMinute] = startTime.split(':').map(Number); 
  const [endHour, endMinute] = endTime.split(':').map(Number); 

  const baseDate = parseISO(date); 

  // Convert the availability window from the user's timezone to UTC 
  let slotStart = zonedTimeToUtc( 
    setMinutes(setHours(startOfDay(baseDate), startHour), startMinute), 
    timezone 
  ); 
  const dayEnd = zonedTimeToUtc( 
    setMinutes(setHours(startOfDay(baseDate), endHour), endMinute), 
    timezone 
  ); 

  const now = new Date(); 

  while (isBefore(slotStart, dayEnd)) { 
    const slotEnd = addMinutes(slotStart, duration); 

    // Slot must end by or at dayEnd 
    if (isAfter(slotEnd, dayEnd) && !isEqual(slotEnd, dayEnd)) { 
      break; 
    } 

    // Skip past slots 
    if (isAfter(slotStart, now)) { 
      const isBooked = bookedSlots.some( 
        (booked) => 
          isBefore(booked.startTime, slotEnd) && 
          isAfter(booked.endTime, slotStart) 
      ); 

      slots.push({ 
        startTime: slotStart.toISOString(), 
        endTime: slotEnd.toISOString(), 
        available: !isBooked, 
      }); 
    } 

    slotStart = addMinutes(slotStart, duration); 
  } 

  return slots; 
} 

/** 
 * Check if a proposed booking overlaps with any existing booking. 
 * Used as a secondary check before DB insert. 
 */ 
export function hasBookingConflict( 
  proposedStart: Date, 
  proposedEnd: Date, 
  existingBookings: { startTime: Date; endTime: Date }[] 
): boolean { 
  return existingBookings.some( 
    (booking) => 
      isBefore(proposedStart, booking.endTime) && 
      isAfter(proposedEnd, booking.startTime) 
  ); 
} 
