'use client'; 

import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 

const schema = z.object({ 
  guestName: z.string().min(1, 'Name is required').max(100), 
  guestEmail: z.string().email('Invalid email address'), 
  notes: z.string().max(1000).optional(), 
}); 

type FormData = z.infer<typeof schema>; 

interface Props { 
  onSubmit: (data: FormData) => Promise<void>; 
  isSubmitting: boolean; 
  error: string | null; 
} 

export function BookingForm({ onSubmit, isSubmitting, error }: Props) { 
  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<FormData>({ resolver: zodResolver(schema) }); 

  return ( 
    <div> 
      <h2 className="mb-6 text-lg font-semibold text-gray-900"> 
        Enter your details 
      </h2> 

      {error && ( 
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"> 
          {error} 
        </div> 
      )} 

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
        <div> 
          <label className="label">Your name</label> 
          <input 
            {...register('guestName')} 
            className="input" 
            placeholder="Jane Smith" 
            autoFocus 
            autoComplete="name" 
          /> 
          {errors.guestName && ( 
            <p className="mt-1 text-xs text-red-600"> 
              {errors.guestName.message} 
            </p> 
          )} 
        </div> 

        <div> 
          <label className="label">Email address</label> 
          <input 
            {...register('guestEmail')} 
            type="email" 
            className="input" 
            placeholder="jane@example.com" 
            autoComplete="email" 
          /> 
          {errors.guestEmail && ( 
            <p className="mt-1 text-xs text-red-600"> 
              {errors.guestEmail.message} 
            </p> 
          )} 
        </div> 

        <div> 
          <label className="label"> 
            Notes <span className="text-gray-400">(optional)</span> 
          </label> 
          <textarea 
            {...register('notes')} 
            rows={3} 
            className="input resize-none" 
            placeholder="Anything you'd like to share before the meeting?" 
          /> 
        </div> 

        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="btn-primary w-full justify-center py-3" 
        > 
          {isSubmitting ? ( 
            <span className="flex items-center gap-2"> 
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> 
              Booking... 
            </span> 
          ) : ( 
            'Confirm booking' 
          )} 
        </button> 
      </form> 
    </div> 
  ); 
} 
