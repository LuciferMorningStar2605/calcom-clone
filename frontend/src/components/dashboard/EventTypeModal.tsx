'use client'; 

import { useEffect } from 'react'; 
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import { useEventTypes } from '@/hooks/useEventTypes'; 
import { DURATION_OPTIONS } from '@/types'; 
import type { EventType } from '@/types'; 
import { Modal } from '@/components/ui/Modal'; 

const schema = z.object({ 
  title: z.string().min(1, 'Title is required').max(100), 
  description: z.string().max(500).optional(), 
  slug: z 
    .string() 
    .min(1, 'Slug is required') 
    .max(50) 
    .regex(/^[a-z0-9-]+$/, 'Only lowercase letters, numbers, hyphens'), 
  duration: z.coerce.number().int().min(5).max(480), 
  color: z.string().regex(/^#[0-9A-Fa-f]{6}$/), 
}); 

type FormData = z.infer<typeof schema>; 

const PRESET_COLORS = [ 
  '#6366f1', 
  '#0ea5e9', 
  '#10b981', 
  '#f59e0b', 
  '#ef4444', 
  '#8b5cf6', 
  '#ec4899', 
  '#14b8a6', 
  '#f97316', 
  '#6b7280', 
]; 

interface Props { 
  isOpen: boolean; 
  onClose: () => void; 
  eventType: EventType | null; 
} 

export function EventTypeModal({ isOpen, onClose, eventType }: Props) { 
  const { create, update, isCreating, isUpdating } = useEventTypes(); 
  const isEditing = !!eventType; 

  const { 
    register, 
    handleSubmit, 
    reset, 
    watch, 
    setValue, 
    formState: { errors }, 
  } = useForm<FormData>({ 
    resolver: zodResolver(schema), 
    defaultValues: { color: '#6366f1', duration: 30 }, 
  }); 

  const selectedColor = watch('color'); 
  const titleValue = watch('title'); 

  useEffect(() => { 
    if (eventType) { 
      reset({ 
        title: eventType.title, 
        description: eventType.description || '', 
        slug: eventType.slug, 
        duration: eventType.duration, 
        color: eventType.color, 
      }); 
    } else { 
      reset({ 
        color: '#6366f1', 
        duration: 30, 
        title: '', 
        description: '', 
        slug: '', 
      }); 
    } 
  }, [eventType, reset, isOpen]); 

  // Auto-generate slug from title when creating 
  useEffect(() => { 
    if (!isEditing && titleValue) { 
      const slug = titleValue 
        .toLowerCase() 
        .replace(/[^a-z0-9\s-]/g, '') 
        .replace(/\s+/g, '-') 
        .slice(0, 50); 
      setValue('slug', slug); 
    } 
  }, [titleValue, isEditing, setValue]); 

  const onSubmit = async (data: FormData) => { 
    if (isEditing) { 
      await update({ id: eventType!.id, data }); 
    } else { 
      await create(data); 
    } 
    onClose(); 
  }; 

  return ( 
    <Modal 
      isOpen={isOpen} 
      onClose={onClose} 
      title={isEditing ? 'Edit event type' : 'New event type'} 
    > 
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
        <div> 
          <label className="label">Title</label> 
          <input 
            {...register('title')} 
            className="input" 
            placeholder="30 Minute Meeting" 
            autoFocus 
          /> 
          {errors.title && ( 
            <p className="mt-1 text-xs text-red-600">{errors.title.message}</p> 
          )} 
        </div> 

        <div> 
          <label className="label"> 
            Description{' '} 
            <span className="text-gray-400">(optional)</span> 
          </label> 
          <textarea 
            {...register('description')} 
            rows={2} 
            className="input resize-none" 
            placeholder="A brief description of this event" 
          /> 
        </div> 

        <div> 
          <label className="label">URL Slug</label> 
          <div className="flex"> 
            <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-xs text-gray-500 whitespace-nowrap"> 
              /your-username/ 
            </span> 
            <input 
              {...register('slug')} 
              className="input rounded-l-none" 
              placeholder="30min" 
            /> 
          </div> 
          {errors.slug && ( 
            <p className="mt-1 text-xs text-red-600">{errors.slug.message}</p> 
          )} 
        </div> 

        <div> 
          <label className="label">Duration</label> 
          <select {...register('duration')} className="input"> 
            {DURATION_OPTIONS.map((opt) => ( 
              <option key={opt.value} value={opt.value}> 
                {opt.label} 
              </option> 
            ))} 
          </select> 
        </div> 

        <div> 
          <label className="label">Color</label> 
          <div className="flex flex-wrap gap-2"> 
            {PRESET_COLORS.map((color) => ( 
              <button 
                key={color} 
                type="button" 
                onClick={() => setValue('color', color)} 
                className={`h-8 w-8 rounded-full transition-transform hover:scale-110 ${ 
                  selectedColor === color 
                    ? 'ring-2 ring-offset-2 ring-gray-400 scale-110' 
                    : '' 
                }`} 
                style={{ backgroundColor: color }} 
              /> 
            ))} 
          </div> 
        </div> 

        <div className="flex justify-end gap-3 border-t border-gray-100 pt-4"> 
          <button type="button" onClick={onClose} className="btn-secondary"> 
            Cancel 
          </button> 
          <button 
            type="submit" 
            disabled={isCreating || isUpdating} 
            className="btn-primary" 
          > 
            {isCreating || isUpdating 
              ? 'Saving...' 
              : isEditing 
              ? 'Save changes' 
              : 'Create event type'} 
          </button> 
        </div> 
      </form> 
    </Modal> 
  ); 
} 
