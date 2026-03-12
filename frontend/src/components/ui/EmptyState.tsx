interface Props { 
  icon: React.ReactNode; 
  title: string; 
  description: string; 
  action?: React.ReactNode; 
} 

export function EmptyState({ icon, title, description, action }: Props) { 
  return ( 
    <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-gray-300 bg-white px-8 py-16 text-center"> 
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-gray-100"> 
        {icon} 
      </div> 
      <h3 className="mb-1.5 text-base font-semibold text-gray-900">{title}</h3> 
      <p className="mb-6 max-w-sm text-sm text-gray-500 leading-relaxed"> 
        {description} 
      </p> 
      {action} 
    </div> 
  ); 
} 
