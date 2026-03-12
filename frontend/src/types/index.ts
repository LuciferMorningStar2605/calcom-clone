export interface User { 
  id: string; 
  name: string; 
  email: string; 
  username: string; 
  bio?: string; 
  timezone: string; 
  avatarUrl?: string; 
  createdAt: string; 
} 

export interface EventType { 
  id: string; 
  title: string; 
  description?: string; 
  slug: string; 
  duration: number; 
  color: string; 
  isActive: boolean; 
  userId: string; 
  createdAt: string; 
  updatedAt: string; 
  _count?: { bookings: number }; 
} 

export interface Availability { 
  id: string; 
  userId: string; 
  dayOfWeek: number; 
  startTime: string; 
  endTime: string; 
  timezone: string; 
  createdAt: string; 
  updatedAt: string; 
} 

export type BookingStatus = 'CONFIRMED' | 'CANCELLED' | 'COMPLETED'; 

export interface Booking { 
  id: string; 
  eventTypeId: string; 
  guestName: string; 
  guestEmail: string; 
  notes?: string; 
  startTime: string; 
  endTime: string; 
  status: BookingStatus; 
  cancelReason?: string; 
  createdAt: string; 
  eventType?: { 
    title: string; 
    duration: number; 
    color: string; 
    slug: string; 
    user?: { 
      name: string; 
      email: string; 
      timezone: string; 
    }; 
  }; 
} 

export interface TimeSlot { 
  startTime: string; 
  endTime: string; 
  available: boolean; 
} 

export interface CreateEventTypeInput { 
  title: string; 
  description?: string; 
  slug: string; 
  duration: number; 
  color?: string; 
} 

export interface UpdateEventTypeInput extends Partial<CreateEventTypeInput> { 
  isActive?: boolean; 
} 

export interface CreateBookingInput { 
  eventTypeId: string; 
  guestName: string; 
  guestEmail: string; 
  startTime: string; 
  notes?: string; 
} 

export interface LoginInput { 
  email: string; 
  password: string; 
} 

export interface RegisterInput { 
  name: string; 
  email: string; 
  username: string; 
  password: string; 
  timezone?: string; 
} 

export const DAY_NAMES = [ 
  'Sunday', 
  'Monday', 
  'Tuesday', 
  'Wednesday', 
  'Thursday', 
  'Friday', 
  'Saturday', 
]; 

export const DAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']; 

export const DURATION_OPTIONS = [ 
  { value: 15, label: '15 minutes' }, 
  { value: 30, label: '30 minutes' }, 
  { value: 45, label: '45 minutes' }, 
  { value: 60, label: '60 minutes' }, 
  { value: 90, label: '90 minutes' }, 
  { value: 120, label: '2 hours' }, 
]; 
