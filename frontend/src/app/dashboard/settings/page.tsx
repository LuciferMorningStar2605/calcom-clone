'use client'; 

import { useEffect } from 'react'; 
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import { useMutation, useQueryClient } from '@tanstack/react-query'; 
import { useAuth } from '@/hooks/useAuth'; 
import * as apiService from '@/services/apiService'; 
import { getErrorMessage } from '@/services/api'; 
import { Save } from 'lucide-react'; 
import toast from 'react-hot-toast'; 

const settingsSchema = z.object({ 
  name: z.string().min(2, 'Name must be at least 2 characters'), 
  username: z 
    .string() 
    .min(3) 
    .max(30) 
    .regex( 
      /^[a-zA-Z0-9_-]+$/, 
      'Only letters, numbers, hyphens, underscores' 
    ), 
  bio: z.string().max(500).optional(), 
  timezone: z.string(), 
}); 

type SettingsForm = z.infer<typeof settingsSchema>; 

export default function SettingsPage() { 
  const { user } = useAuth(); 
  const queryClient = useQueryClient(); 

  const { 
    register, 
    handleSubmit, 
    reset, 
    formState: { errors, isDirty }, 
  } = useForm<SettingsForm>({ resolver: zodResolver(settingsSchema) }); 

  useEffect(() => { 
    if (user) { 
      reset({ 
        name: user.name, 
        username: user.username, 
        bio: user.bio || '', 
        timezone: user.timezone, 
      }); 
    } 
  }, [user, reset]); 

  const mutation = useMutation({ 
    mutationFn: (data: SettingsForm) => apiService.updateMe(data), 
    onSuccess: (updatedUser) => { 
      queryClient.setQueryData(['auth', 'me'], updatedUser); 
      toast.success('Profile updated!'); 
      reset(updatedUser as SettingsForm); 
    }, 
    onError: (err) => toast.error(getErrorMessage(err)), 
  }); 

  return ( 
    <div className="animate-fade-in max-w-2xl"> 
      <div className="mb-8"> 
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1> 
        <p className="mt-1 text-sm text-gray-500"> 
          Manage your account and profile settings. 
        </p> 
      </div> 

      <form onSubmit={handleSubmit((data) => mutation.mutate(data))}> 
        <div className="card divide-y divide-gray-100"> 
          <div className="p-6"> 
            <h2 className="mb-4 text-base font-semibold text-gray-900"> 
              Profile 
            </h2> 
            <div className="space-y-4"> 
              <div> 
                <label className="label">Full name</label> 
                <input 
                  {...register('name')} 
                  className="input" 
                  placeholder="Your full name" 
                /> 
                {errors.name && ( 
                  <p className="mt-1 text-xs text-red-600"> 
                    {errors.name.message} 
                  </p> 
                )} 
              </div> 

              <div> 
                <label className="label">Username</label> 
                <div className="flex"> 
                  <span className="inline-flex items-center rounded-l-lg border border-r-0 border-gray-300 bg-gray-50 px-3 text-sm text-gray-500"> 
                    calclone.com/ 
                  </span> 
                  <input 
                    {...register('username')} 
                    className="input rounded-l-none" 
                    placeholder="username" 
                  /> 
                </div> 
                {errors.username && ( 
                  <p className="mt-1 text-xs text-red-600"> 
                    {errors.username.message} 
                  </p> 
                )} 
              </div> 

              <div> 
                <label className="label">Bio</label> 
                <textarea 
                  {...register('bio')} 
                  rows={3} 
                  className="input resize-none" 
                  placeholder="Tell people a bit about yourself..." 
                /> 
              </div> 

              <div> 
                <label className="label">Timezone</label> 
                <select {...register('timezone')} className="input"> 
                  {Intl.supportedValuesOf('timeZone').map((tz) => ( 
                    <option key={tz} value={tz}> 
                      {tz} 
                    </option> 
                  ))} 
                </select> 
              </div> 
            </div> 
          </div> 

          <div className="flex items-center justify-between p-4"> 
            <p className="text-xs text-gray-400">Email: {user?.email}</p> 
            <button 
              type="submit" 
              disabled={mutation.isPending || !isDirty} 
              className="btn-primary" 
            > 
              <Save className="h-4 w-4" /> 
              {mutation.isPending ? 'Saving...' : 'Save changes'} 
            </button> 
          </div> 
        </div> 
      </form> 
    </div> 
  ); 
} 
