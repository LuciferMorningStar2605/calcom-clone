'use client'; 
 
 import { useQuery } from '@tanstack/react-query'; 
 import { useParams } from 'next/navigation'; 
 import Link from 'next/link'; 
 import * as apiService from '@/services/apiService'; 
 import { formatDuration, getInitials } from '@/lib/utils'; 
 import { Clock } from 'lucide-react'; 
 
 export default function PublicProfilePage() { 
   const params = useParams(); 
   const username = params.username as string; 
 
   const { data, isLoading, error } = useQuery({ 
     queryKey: ['public', username], 
     queryFn: () => apiService.getPublicUserPage(username), 
   }); 
 
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
           <h1 className="text-2xl font-bold text-gray-900">User not found</h1> 
           <p className="mt-2 text-gray-500">The user you are looking for does not exist.</p> 
         </div> 
       </div> 
     ); 
   } 
 
   const { name, bio, eventTypes } = data; 
 
   return ( 
     <div className="min-h-screen bg-gray-50 py-12"> 
       <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8"> 
         <div className="text-center"> 
           <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-brand-600 text-2xl font-bold text-white shadow-lg"> 
             {getInitials(name)} 
           </div> 
           <h1 className="mt-4 text-3xl font-bold text-gray-900">{name}</h1> 
           {bio && <p className="mt-2 text-lg text-gray-500">{bio}</p>} 
         </div> 
 
         <div className="mt-12 grid gap-6 sm:grid-cols-2"> 
           {eventTypes.map((type) => ( 
             <Link 
               key={type.id} 
               href={`/${username}/${type.slug}`} 
               className="group relative flex flex-col overflow-hidden rounded-xl border border-gray-200 bg-white p-6 shadow-sm transition-all hover:border-brand-300 hover:shadow-md" 
             > 
               <div 
                 className="absolute left-0 top-0 h-full w-1.5" 
                 style={{ backgroundColor: type.color }} 
               /> 
               <h3 className="text-lg font-bold text-gray-900 group-hover:text-brand-600"> 
                 {type.title} 
               </h3> 
               {type.description && ( 
                 <p className="mt-2 line-clamp-2 text-sm text-gray-500"> 
                   {type.description} 
                 </p> 
               )} 
               <div className="mt-4 flex items-center gap-2 text-sm font-medium text-gray-600"> 
                 <Clock className="h-4 w-4" /> 
                 {formatDuration(type.duration)} 
               </div> 
             </Link> 
           ))} 
         </div> 
 
         {eventTypes.length === 0 && ( 
           <div className="mt-12 rounded-xl border-2 border-dashed border-gray-200 p-12 text-center"> 
             <p className="text-gray-500">No public event types available.</p> 
           </div> 
         )} 
       </div> 
     </div> 
   ); 
 }