import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast'; 
import * as apiService from '@/services/apiService'; 
import type { CreateBookingInput } from '@/types'; 
import { getErrorMessage } from '@/services/api'; 

const BOOKINGS_KEY = ['bookings']; 

export function useBookings(filter?: 'upcoming' | 'past' | 'cancelled') { 
  const queryClient = useQueryClient(); 

  const query = useQuery({ 
    queryKey: [...BOOKINGS_KEY, filter], 
    queryFn: () => apiService.getBookings(filter), 
  }); 

  const cancelMutation = useMutation({ 
    mutationFn: (id: string) => apiService.cancelBooking(id), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: BOOKINGS_KEY }); 
      toast.success('Booking cancelled'); 
    }, 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 

  return { 
    bookings: query.data ?? [], 
    isLoading: query.isLoading, 
    error: query.error, 
    cancel: cancelMutation.mutateAsync, 
    isCancelling: cancelMutation.isPending, 
  }; 
} 

export function useCreateBooking() { 
  return useMutation({ 
    mutationFn: (data: CreateBookingInput) => apiService.createBooking(data), 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 
} 

export function useAvailableSlots( 
  eventTypeId: string | null, 
  date: string | null 
) { 
  return useQuery({ 
    queryKey: ['slots', eventTypeId, date], 
    queryFn: () => apiService.getAvailableSlots(eventTypeId!, date!), 
    enabled: !!date && !!eventTypeId, 
    staleTime: 30 * 1000, 
  }); 
} 
