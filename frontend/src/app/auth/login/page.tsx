'use client'; 

import { useState } from 'react'; 
import { useForm } from 'react-hook-form'; 
import { zodResolver } from '@hookform/resolvers/zod'; 
import { z } from 'zod'; 
import Link from 'next/link'; 
import { useAuth } from '@/hooks/useAuth'; 
import { Eye, EyeOff } from 'lucide-react'; 

const loginSchema = z.object({ 
  email: z.string().email('Invalid email address'), 
  password: z.string().min(1, 'Password is required'), 
}); 

type LoginForm = z.infer<typeof loginSchema>; 

export default function LoginPage() { 
  const { loginAsync, isLoginPending, loginError } = useAuth(); 
  const [showPassword, setShowPassword] = useState(false); 

  const { 
    register, 
    handleSubmit, 
    formState: { errors }, 
  } = useForm<LoginForm>({ resolver: zodResolver(loginSchema) }); 

  const onSubmit = async (data: LoginForm) => { 
    try { 
      await loginAsync(data); 
    } catch { 
      // error surfaced via loginError 
    } 
  }; 

  return ( 
    <div className="card p-8 animate-slide-up"> 
      <div className="mb-6 text-center"> 
        <h1 className="text-2xl font-bold text-gray-900">Welcome back</h1> 
        <p className="mt-1 text-sm text-gray-500">Sign in to your account</p> 
      </div> 

      {loginError && ( 
        <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"> 
          {loginError} 
        </div> 
      )} 

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4"> 
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
          <label className="label">Password</label> 
          <div className="relative"> 
            <input 
              {...register('password')} 
              type={showPassword ? 'text' : 'password'} 
              className="input pr-10" 
              placeholder="••••••••" 
              autoComplete="current-password" 
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
          disabled={isLoginPending} 
          className="btn-primary w-full justify-center py-2.5" 
        > 
          {isLoginPending ? ( 
            <span className="flex items-center gap-2"> 
              <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" /> 
              Signing in... 
            </span> 
          ) : ( 
            'Sign in' 
          )} 
        </button> 
      </form> 

      <div className="mt-4 border-t border-gray-100 pt-4"> 
        <p className="text-center text-sm text-gray-500"> 
          Demo:{' '} 
          <span className="font-mono text-xs"> 
            demo@calclone.com / password123 
          </span> 
        </p> 
      </div> 

      <p className="mt-4 text-center text-sm text-gray-500"> 
        Don&apos;t have an account?{' '} 
        <Link 
          href="/auth/register" 
          className="font-medium text-brand-600 hover:text-brand-700" 
        > 
          Sign up 
        </Link> 
      </p> 
    </div> 
  ); 
} 
