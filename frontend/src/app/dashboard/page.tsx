'use client'; 

import { useState } from 'react'; 
import { useAuth } from '@/hooks/useAuth'; 
import { useEventTypes } from '@/hooks/useEventTypes'; 
import { EventTypeCard } from '@/components/dashboard/EventTypeCard'; 
import { EventTypeModal } from '@/components/dashboard/EventTypeModal'; 
import { EmptyState } from '@/components/ui/EmptyState'; 
import { Plus, Calendar } from 'lucide-react'; 
import type { EventType } from '@/types'; 

export default function DashboardPage() { 
  const { user } = useAuth(); 
  const { eventTypes, isLoading } = useEventTypes(); 
  const [isModalOpen, setIsModalOpen] = useState(false); 
  const [editingEventType, setEditingEventType] = useState<EventType | null>( 
    null 
  ); 

  const handleEdit = (eventType: EventType) => { 
    setEditingEventType(eventType); 
    setIsModalOpen(true); 
  }; 

  const handleCreate = () => { 
    setEditingEventType(null); 
    setIsModalOpen(true); 
  }; 

  const handleClose = () => { 
    setIsModalOpen(false); 
    setEditingEventType(null); 
  }; 

  return ( 
    <div className="animate-fade-in"> 
      <div className="mb-8 flex items-start justify-between gap-4"> 
        <div> 
          <h1 className="text-2xl font-bold text-gray-900">Event Types</h1> 
          <p className="mt-1 text-sm text-gray-500"> 
            Create events to share with people so they can book time with you. 
          </p> 
        </div> 
        <button onClick={handleCreate} className="btn-primary flex-shrink-0"> 
          <Plus className="h-4 w-4" /> 
          New event type 
        </button> 
      </div> 

      {isLoading ? ( 
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> 
          {[1, 2, 3].map((i) => ( 
            <div key={i} className="card h-48 animate-pulse bg-gray-100" /> 
          ))} 
        </div> 
      ) : eventTypes.length === 0 ? ( 
        <EmptyState 
          icon={<Calendar className="h-10 w-10 text-gray-400" />} 
          title="No event types yet" 
          description="Create your first event type to start accepting bookings." 
          action={ 
            <button onClick={handleCreate} className="btn-primary"> 
              <Plus className="h-4 w-4" /> 
              Create event type 
            </button> 
          } 
        /> 
      ) : ( 
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3"> 
          {eventTypes.map((et) => ( 
            <EventTypeCard 
              key={et.id} 
              eventType={et} 
              username={user?.username ?? ''} 
              onEdit={() => handleEdit(et)} 
            /> 
          ))} 
        </div> 
      )} 

      <EventTypeModal 
        isOpen={isModalOpen} 
        onClose={handleClose} 
        eventType={editingEventType} 
      /> 
    </div> 
  ); 
} 
