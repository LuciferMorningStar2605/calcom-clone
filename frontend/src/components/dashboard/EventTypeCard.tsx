'use client'; 

import { useState } from 'react'; 
import Link from 'next/link'; 
import { useEventTypes } from '@/hooks/useEventTypes'; 
import { formatDuration } from '@/lib/utils'; 
import type { EventType } from '@/types'; 
import { 
  Clock, 
  Copy, 
  ExternalLink, 
  Pencil, 
  Trash2, 
  MoreVertical, 
  Check, 
  ToggleLeft, 
  ToggleRight, 
} from 'lucide-react'; 

interface Props { 
  eventType: EventType; 
  username: string; 
  onEdit: () => void; 
} 

export function EventTypeCard({ eventType, username, onEdit }: Props) { 
  const { delete: deleteEventType, update, isDeleting } = useEventTypes(); 
  const [copied, setCopied] = useState(false); 
  const [menuOpen, setMenuOpen] = useState(false); 
  const [confirmDelete, setConfirmDelete] = useState(false); 

  const bookingUrl = `${ 
    typeof window !== 'undefined' ? window.location.origin : '' 
  }/${username}/${eventType.slug}`; 

  const handleCopy = async () => { 
    await navigator.clipboard.writeText(bookingUrl); 
    setCopied(true); 
    setTimeout(() => setCopied(false), 2000); 
  }; 

  const handleDelete = async () => { 
    if (!confirmDelete) { 
      setConfirmDelete(true); 
      return; 
    } 
    await deleteEventType(eventType.id); 
    setConfirmDelete(false); 
    setMenuOpen(false); 
  }; 

  const handleToggleActive = async () => { 
    await update({ id: eventType.id, data: { isActive: !eventType.isActive } }); 
    setMenuOpen(false); 
  }; 

  return ( 
    <div 
      className={`card-hover group relative flex flex-col overflow-hidden transition-all ${ 
        !eventType.isActive ? 'opacity-60' : '' 
      }`} 
    > 
      <div 
        className="h-1 w-full flex-shrink-0" 
        style={{ backgroundColor: eventType.color }} 
      /> 

      <div className="flex flex-1 flex-col p-5"> 
        <div className="mb-3 flex items-start justify-between gap-2"> 
          <div className="min-w-0 flex-1"> 
            <h3 className="truncate font-semibold text-gray-900"> 
              {eventType.title} 
            </h3> 
            <div className="mt-0.5 flex items-center gap-1.5 text-sm text-gray-500"> 
              <Clock className="h-3.5 w-3.5" /> 
              {formatDuration(eventType.duration)} 
              {!eventType.isActive && ( 
                <span className="badge bg-gray-100 text-gray-500 ml-1"> 
                  Inactive 
                </span> 
              )} 
            </div> 
          </div> 

          <div className="relative"> 
            <button 
              onClick={() => { 
                setMenuOpen(!menuOpen); 
                setConfirmDelete(false); 
              }} 
              className="rounded-lg p-1.5 text-gray-400 opacity-0 transition-opacity hover:bg-gray-100 hover:text-gray-700 group-hover:opacity-100" 
            > 
              <MoreVertical className="h-4 w-4" /> 
            </button> 

            {menuOpen && ( 
              <> 
                <div 
                  className="fixed inset-0 z-10" 
                  onClick={() => { 
                    setMenuOpen(false); 
                    setConfirmDelete(false); 
                  }} 
                /> 
                <div className="absolute right-0 top-full z-20 mt-1 w-44 rounded-lg border border-gray-200 bg-white py-1 shadow-modal"> 
                  <button 
                    onClick={() => { 
                      onEdit(); 
                      setMenuOpen(false); 
                    }} 
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" 
                  > 
                    <Pencil className="h-4 w-4" /> 
                    Edit 
                  </button> 
                  <button 
                    onClick={handleToggleActive} 
                    className="flex w-full items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50" 
                  > 
                    {eventType.isActive ? ( 
                      <ToggleRight className="h-4 w-4" /> 
                    ) : ( 
                      <ToggleLeft className="h-4 w-4" /> 
                    )} 
                    {eventType.isActive ? 'Deactivate' : 'Activate'} 
                  </button> 
                  <div className="my-1 border-t border-gray-100" /> 
                  <button 
                    onClick={handleDelete} 
                    disabled={isDeleting} 
                    className={`flex w-full items-center gap-2 px-3 py-2 text-sm hover:bg-red-50 ${ 
                      confirmDelete 
                        ? 'font-medium text-red-700' 
                        : 'text-red-600' 
                    }`} 
                  > 
                    <Trash2 className="h-4 w-4" /> 
                    {confirmDelete ? 'Click to confirm' : 'Delete'} 
                  </button> 
                </div> 
              </> 
            )} 
          </div> 
        </div> 

        {eventType.description && ( 
          <p className="mb-4 flex-1 text-sm text-gray-500 line-clamp-2 leading-relaxed"> 
            {eventType.description} 
          </p> 
        )} 

        {eventType._count !== undefined && ( 
          <p className="mb-3 text-xs text-gray-400"> 
            {eventType._count.bookings} booking 
            {eventType._count.bookings !== 1 ? 's' : ''} total 
          </p> 
        )} 

        <div className="mt-auto flex items-center gap-2 border-t border-gray-100 pt-3"> 
          <button 
            onClick={handleCopy} 
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50" 
          > 
            {copied ? ( 
              <> 
                <Check className="h-3.5 w-3.5 text-green-600" /> 
                <span className="text-green-600">Copied!</span> 
              </> 
            ) : ( 
              <> 
                <Copy className="h-3.5 w-3.5" /> 
                Copy link 
              </> 
            )} 
          </button> 
          <Link 
            href={`/${username}/${eventType.slug}`} 
            target="_blank" 
            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg border border-gray-200 px-3 py-1.5 text-xs font-medium text-gray-600 transition-colors hover:bg-gray-50" 
          > 
            <ExternalLink className="h-3.5 w-3.5" /> 
            Preview 
          </Link> 
        </div> 
      </div> 
    </div> 
  ); 
} 
