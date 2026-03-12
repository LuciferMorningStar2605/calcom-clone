import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'; 
import toast from 'react-hot-toast'; 
import * as apiService from '@/services/apiService'; 
import type { Availability } from '@/types'; 
import { getErrorMessage } from '@/services/api'; 

const AVAILABILITY_KEY = ['availability']; 

export function useAvailability() { 
  const queryClient = useQueryClient(); 

  const query = useQuery({ 
    queryKey: AVAILABILITY_KEY, 
    queryFn: apiService.getAvailability, 
  }); 

  const upsertMutation = useMutation({ 
    mutationFn: ( 
      slots: Omit<Availability, 'id' | 'userId' | 'createdAt' | 'updatedAt'>[] 
    ) => apiService.upsertAvailability(slots), 
    onSuccess: () => { 
      queryClient.invalidateQueries({ queryKey: AVAILABILITY_KEY }); 
      toast.success('Availability saved!'); 
    }, 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 

  return { 
    availability: query.data ?? [], 
    isLoading: query.isLoading, 
    save: upsertMutation.mutateAsync, 
    isSaving: upsertMutation.isPending, 
  }; 
} 
