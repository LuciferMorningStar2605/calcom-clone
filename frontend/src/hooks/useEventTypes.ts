import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast'; 
import * as apiService from '@/services/apiService'; 
import type { CreateEventTypeInput, UpdateEventTypeInput } from '@/types'; 
import { getErrorMessage } from '@/services/api'; 

const EVENT_TYPES_KEY = ['eventTypes']; 

export function useEventTypes() { 
  const queryClient = useQueryClient(); 

  const query = useQuery({ 
    queryKey: EVENT_TYPES_KEY, 
    queryFn: apiService.getEventTypes, 
  }); 

  const createMutation = useMutation({ 
    mutationFn: (data: CreateEventTypeInput) => 
      apiService.createEventType(data), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: EVENT_TYPES_KEY }); 
      toast.success('Event type created!'); 
    }, 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 

  const updateMutation = useMutation({ 
    mutationFn: ({ 
      id, 
      data, 
    }: { 
      id: string; 
      data: UpdateEventTypeInput; 
    }) => apiService.updateEventType(id, data), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: EVENT_TYPES_KEY }); 
      toast.success('Event type updated!'); 
    }, 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 

  const deleteMutation = useMutation({ 
    mutationFn: (id: string) => apiService.deleteEventType(id), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: EVENT_TYPES_KEY }); 
      toast.success('Event type deleted'); 
    }, 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 

  return { 
    eventTypes: query.data ?? [], 
    isLoading: query.isLoading, 
    error: query.error, 
    create: createMutation.mutateAsync, 
    isCreating: createMutation.isPending, 
    update: updateMutation.mutateAsync, 
    isUpdating: updateMutation.isPending, 
    delete: deleteMutation.mutateAsync, 
    isDeleting: deleteMutation.isPending, 
  }; 
} 
