import { apiClient } from './api'; 
import type { 
  User, 
  EventType, 
  Availability, 
  Booking, 
  TimeSlot, 
  CreateEventTypeInput, 
  UpdateEventTypeInput, 
  CreateBookingInput, 
  LoginInput, 
  RegisterInput, 
} from '@/types'; 

// ─── Auth ────────────────────────────────────────────────────────────────── 

export async function register(data: RegisterInput) { 
  const res = await apiClient.post<{ 
    data: { user: User; token: string }; 
  }>('/auth/register', data); 
  return res.data.data; 
} 

export async function login(data: LoginInput) { 
  const res = await apiClient.post<{ 
    data: { user: User; token: string }; 
  }>('/auth/login', data); 
  return res.data.data; 
} 

export async function getMe() { 
  const res = await apiClient.get<{ data: User }>('/auth/me'); 
  return res.data.data; 
} 

export async function updateMe(data: Partial<User>) { 
  const res = await apiClient.put<{ data: User }>('/auth/me', data); 
  return res.data.data; 
} 

// ─── Event Types ─────────────────────────────────────────────────────────── 

export async function getEventTypes() { 
  const res = await apiClient.get<{ data: EventType[] }>('/event-types'); 
  return res.data.data; 
} 

export async function getEventType(id: string) { 
  const res = await apiClient.get<{ data: EventType }>(`/event-types/${id}`); 
  return res.data.data; 
} 

export async function createEventType(data: CreateEventTypeInput) { 
  const res = await apiClient.post<{ data: EventType }>('/event-types', data); 
  return res.data.data; 
} 

export async function updateEventType(id: string, data: UpdateEventTypeInput) { 
  const res = await apiClient.put<{ data: EventType }>( 
    `/event-types/${id}`, 
    data 
  ); 
  return res.data.data; 
} 

export async function deleteEventType(id: string) { 
  await apiClient.delete(`/event-types/${id}`); 
} 

// ─── Availability ────────────────────────────────────────────────────────── 

export async function getAvailability() { 
  const res = await apiClient.get<{ data: Availability[] }>('/availability'); 
  return res.data.data; 
} 

export async function upsertAvailability( 
  slots: Omit<Availability, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] 
) { 
  const res = await apiClient.post<{ data: Availability[] }>('/availability', { 
    slots, 
  }); 
  return res.data.data; 
} 

// ─── Bookings ────────────────────────────────────────────────────────────── 

export async function getBookings( 
  filter?: 'upcoming' | 'past' | 'cancelled' 
) { 
  const res = await apiClient.get<{ data: Booking[] }>('/bookings', { 
    params: filter ? { filter } : undefined, 
  }); 
  return res.data.data; 
} 

export async function getAvailableSlots(eventTypeId: string, date: string) { 
  const res = await apiClient.get<{ 
    data: { slots: TimeSlot[]; timezone: string }; 
  }>('/bookings/slots', { params: { eventTypeId, date } }); 
  return res.data.data; 
} 

export async function createBooking(data: CreateBookingInput) { 
  const res = await apiClient.post<{ data: Booking }>('/bookings', data); 
  return res.data.data; 
} 

export async function cancelBooking(id: string) { 
  const res = await apiClient.delete<{ data: Booking }>(`/bookings/${id}`); 
  return res.data.data; 
} 

// ─── Public ──────────────────────────────────────────────────────────────── 

export async function getPublicEventType(username: string, slug: string) { 
  const res = await apiClient.get<{ 
    data: { 
      eventType: EventType; 
      host: { 
        name: string; 
        username: string; 
        bio: string | null; 
        avatarUrl: string | null; 
        timezone: string; 
      }; 
      availability: Availability[]; 
    }; 
  }>(`/public/${username}/${slug}`); 
  return res.data.data; 
} 

export async function getPublicUserPage(username: string) { 
  const res = await apiClient.get<{ 
    data: { 
      name: string; 
      username: string; 
      bio: string | null; 
      eventTypes: EventType[]; 
    }; 
  }>(`/public/${username}`); 
  return res.data.data; 
} 
