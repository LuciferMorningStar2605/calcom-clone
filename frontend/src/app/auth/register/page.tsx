'use client'; 

import { useState } from 'react'; 
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import Link from 'next/link'; 
import { useAuth } from '@/hooks/useAuth'; 
import { Eye, EyeOff } from 'lucide-react'; 

const registerSchema = z.object({ 
  name: z.string().min(2, 'Name must be at least 2 characters'), 
  email: z.string().email('Invalid email address'), 
  username: z 
    .string() 
    .min(3, 'Must be at least 3 characters') 
    .max(30) 
    .regex( 
      /^[a-zA-Z0-9_-]+$/, 
      'Only letters, numbers, hyphens, and underscores' 
    ), 
  password: z.string().min(8, 'Password must be at least 8 characters'), 
}); 

type RegisterForm = z.infer<typeof registerSchema>; 

export default function RegisterPage() { 
  const { registerAsync, isRegisterPending, registerError } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false); 

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<RegisterForm>({ resolver: zodResolver(registerSchema) }); 

  const onSubmit = async (data: RegisterForm) => { 
    try { 
      await registerAsync({ 
        ...data, 
        timezone: Intl.DateTimeFormat().resolvedOptions().timeZone, 
      }); 
    } catch { 
      // error surfaced via registerError 
    } 
  }; 

  return ( 
    <div className="card p-8 animate-slide-up"> 
      <div className="mb-6 text-center"> 
        <h1 className="text-2xl font-bold text-gray-900">Create an account</h1> 
        <p className="mt-1 text-sm text-gray-500"> 
          Start scheduling in minutes 
        </p> 
      </div> 

      {registerError && ( 
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"> 
          {registerError} 
        </div> 
      )} 

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
        <div> 
          <label className="label">Full name</label> 
          <input 
            {...register('name')} 
            className="input" 
            placeholder="Alex Johnson" 
            autoComplete="name" 
          /> 
          {errors.name && ( 
            <p className="mt-1 text-xs text-red-600">{errors.name.message}</p> 
          )} 
        </div> 

        <div> 
          <label className="label">Email</label> 
          <input 
            {...register('email')} 
            type="email" 
            className="input" 
            placeholder="you@example.com" 
            autoComplete="email" 
          /> 
          {errors.email && ( 
            <p className="mt-1 text-xs text-red-600">{errors.email.message}</p> 
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
              placeholder="yourusername" 
              autoComplete="username" 
            /> 
          </div> 
          {errors.username && ( 
            <p className="mt-1 text-xs text-red-600"> 
              {errors.username.message} 
            </p> 
          )} 
        </div> 

        <div> 
          <label className="label">Password</label> 
          <div className="relative"> 
            <input 
              {...register('password')} 
              type={showPassword ? 'text' : 'password'} 
              className="input pr-10" 
              placeholder="Min. 8 characters" 
              autoComplete="new-password" 
            /> 
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)} 
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600" 
            > 
              {showPassword ? ( 
                <EyeOff className="h-4 w-4" /> 
              ) : ( 
                <Eye className="h-4 w-4" /> 
              )} 
            </button> 
          </div> 
          {errors.password && ( 
            <p className="mt-1 text-xs text-red-600"> 
              {errors.password.message} 
            </p> 
          )} 
        </div> 

        <button 
          type="submit" 
          disabled={isRegisterPending} 
          className="btn-primary w-full justify-center py-2.5" 
        > 
          {isRegisterPending ? ( 
            <span className="flex items-center gap-2"> 
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> 
              Creating account... 
            </span> 
          ) : ( 
            'Create account' 
          )} 
        </button> 
      </form> 

      <p className="mt-6 text-center text-sm text-gray-500"> 
        Already have an account?{' '} 
        <Link 
          href="/auth/login" 
          className="font-medium text-brand-600 hover:text-brand-700" 
        > 
          Sign in 
        </Link> 
      </p> 
    </div> 
  ); 
} 
