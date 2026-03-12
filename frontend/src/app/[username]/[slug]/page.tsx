'use client'; 
 
 import { useEffect, useState } from 'react'; 
 import { useQuery } from '@tanstack/react-query'; 
 import { useParams } from 'next/navigation'; 
 import { format, parseISO } from 'date-fns'; 
 import * as apiService from '@/services/apiService'; 
 import { useAvailableSlots, useCreateBooking } from '@/hooks/useBookings'; 
 import { BookingCalendar } from '@/components/booking/BookingCalendar'; 
 import { TimeSlotPicker } from '@/components/booking/TimeSlotPicker'; 
 import { BookingForm } from '@/components/booking/BookingForm'; 
 import { BookingConfirmation } from '@/components/booking/BookingConfirmation'; 
 import { formatDuration, getInitials } from '@/lib/utils'; 
 import { getErrorMessage } from '@/services/api'; 
 import { Clock, Globe, ChevronLeft } from 'lucide-react'; 
 import type { Booking } from '@/types'; 
 
 type Step = 'calendar' | 'time' | 'form' | 'confirmed'; 
 
 export default function BookingPage() { 
   const params = useParams(); 
   const username = params.username as string; 
   const slug = params.slug as string; 
 
  const [selectedDate, setSelectedDate] = useState<Date | null>(null); 
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null); 
  const [step, setStep] = useState<Step>('calendar'); 
  const [eventTypeId, setEventTypeId] = useState<string | null>(null);
  const [confirmedBooking, setConfirmedBooking] = useState<Booking | null>( 
    null 
  ); 
 
  const { data, isLoading, error } = useQuery({ 
    queryKey: ['public', username, slug], 
    queryFn: () => apiService.getPublicEventType(username, slug), 
  }); 

  useEffect(() => {
    setEventTypeId(data?.eventType.id ?? null);
  }, [data?.eventType.id]);
 
  const dateStr = selectedDate ? format(selectedDate, 'yyyy-MM-dd') : null; 
  const { data: slotsData, isLoading: isSlotsLoading } = useAvailableSlots( 
    eventTypeId,
    dateStr 
  ); 
 
   const createBookingMutation = useCreateBooking(); 
 
   if (isLoading) { 
     return ( 
       <div className="flex min-h-screen items-center justify-center"> 
         <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-600 border-t-transparent" /> 
       </div> 
     ); 
   } 
 
   if (error || !data) { 
     return ( 
       <div className="flex min-h-screen items-center justify-center"> 
         <div className="text-center"> 
           <h1 className="text-2xl font-bold text-gray-900">Page not found</h1> 
           <p className="mt-2 text-gray-500"> 
             This booking link is invalid or no longer active. 
           </p> 
         </div> 
       </div> 
     ); 
   } 
 
   const { eventType, host, availability } = data; 
   const availableDays = availability.map((a) => a.dayOfWeek); 
 
   const handleDateSelect = (date: Date) => { 
     setSelectedDate(date); 
     setSelectedSlot(null); 
     setStep('time'); 
   }; 
 
   const handleSlotSelect = (slot: string) => { 
     setSelectedSlot(slot); 
     setStep('form'); 
   }; 
 
  const handleBookingSubmit = async (formData: { 
    guestName: string; 
    guestEmail: string; 
    notes?: string; 
  }) => { 
    if (!selectedSlot || !eventTypeId) return; 
    const booking = await createBookingMutation.mutateAsync({ 
      eventTypeId, 
      guestName: formData.guestName, 
      guestEmail: formData.guestEmail, 
      startTime: selectedSlot, 
       notes: formData.notes, 
     }); 
     setConfirmedBooking(booking); 
     setStep('confirmed'); 
   }; 
 
   const handleBack = () => { 
     if (step === 'time') { 
       setSelectedDate(null); 
       setStep('calendar'); 
     } else if (step === 'form') { 
       setSelectedSlot(null); 
       setStep('time'); 
     } 
   }; 
 
   if (step === 'confirmed' && confirmedBooking) { 
     return ( 
       <BookingConfirmation 
         booking={confirmedBooking} 
         host={host} 
         eventType={eventType} 
       /> 
     ); 
   } 
 
   return ( 
     <div className="min-h-screen bg-gray-50"> 
       <div className="mx-auto max-w-5xl px-4 py-12 sm:px-6 lg:px-8"> 
         <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-modal"> 
           <div className="flex flex-col lg:flex-row"> 
             {/* Left panel */} 
             <div className="border-b border-gray-100 p-8 lg:w-80 lg:flex-shrink-0 lg:border-b-0 lg:border-r"> 
               <div className="mb-6 flex items-center gap-3"> 
                 <div 
                   className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full text-sm font-semibold text-white" 
                   style={{ backgroundColor: eventType.color }} 
                 > 
                   {getInitials(host.name)} 
                 </div> 
                 <div> 
                   <p className="text-sm font-medium text-gray-900"> 
                     {host.name} 
                   </p> 
                   {host.bio && ( 
                     <p className="line-clamp-1 text-xs text-gray-500"> 
                       {host.bio} 
                     </p> 
                   )} 
                 </div> 
               </div> 
 
               <h1 className="mb-2 text-xl font-bold text-gray-900"> 
                 {eventType.title} 
               </h1> 
               {eventType.description && ( 
                 <p className="mb-4 text-sm leading-relaxed text-gray-500"> 
                   {eventType.description} 
                 </p> 
               )} 
 
               <div className="space-y-2"> 
                 <div className="flex items-center gap-2 text-sm text-gray-600"> 
                   <Clock className="h-4 w-4 text-gray-400" /> 
                   {formatDuration(eventType.duration)} 
                 </div> 
                 <div className="flex items-center gap-2 text-sm text-gray-600"> 
                   <Globe className="h-4 w-4 text-gray-400" /> 
                   {host.timezone} 
                 </div> 
               </div> 
 
               {selectedDate && ( 
                 <div className="mt-6 rounded-lg border border-gray-100 bg-gray-50 p-3 text-sm"> 
                   <p className="font-medium text-gray-700"> 
                     {format(selectedDate, 'EEEE, MMMM d, yyyy')} 
                   </p> 
                   {selectedSlot && ( 
                     <p className="text-gray-500"> 
                       {format(parseISO(selectedSlot), 'h:mm a')} 
                     </p> 
                   )} 
                 </div> 
               )} 
             </div> 
 
             {/* Right panel */} 
             <div className="flex-1 p-8"> 
               {step !== 'calendar' && ( 
                 <button 
                   onClick={handleBack} 
                   className="mb-6 flex items-center gap-1 text-sm text-gray-500 transition-colors hover:text-gray-900" 
                 > 
                   <ChevronLeft className="h-4 w-4" /> 
                   Back 
                 </button> 
               )} 
 
               {step === 'calendar' && ( 
                 <BookingCalendar 
                   availableDays={availableDays} 
                   onDateSelect={handleDateSelect} 
                   selectedDate={selectedDate} 
                 /> 
               )} 
 
               {step === 'time' && selectedDate && ( 
                 <TimeSlotPicker 
                   date={selectedDate} 
                   slots={slotsData?.slots ?? []} 
                   timezone={slotsData?.timezone ?? host.timezone} 
                   isLoading={isSlotsLoading} 
                   onSlotSelect={handleSlotSelect} 
                   selectedSlot={selectedSlot} 
                 /> 
               )} 
 
               {step === 'form' && selectedSlot && ( 
                 <BookingForm 
                   onSubmit={handleBookingSubmit} 
                   isSubmitting={createBookingMutation.isPending} 
                   error={ 
                     createBookingMutation.error 
                       ? getErrorMessage(createBookingMutation.error) 
                       : null 
                   } 
                 /> 
               )} 
             </div> 
           </div> 
         </div> 
       </div> 
     </div> 
   ); 
 }
