import { prisma } from '../lib/prisma'; 
import { 
  NotFoundError, 
  ConflictError, 
  ForbiddenError, 
} from '../utils/errors'; 

interface CreateEventTypeInput { 
  title: string; 
  description?: string; 
  slug: string; 
  duration: number; 
  color?: string; 
  userId: string; 
} 

interface UpdateEventTypeInput { 
  title?: string; 
  description?: string; 
  slug?: string; 
  duration?: number; 
  color?: string; 
  isActive?: boolean; 
} 

export async function getEventTypesByUser(userId: string) { 
  return prisma.eventType.findMany({ 
    where: { userId }, 
    orderBy: { createdAt: 'asc' }, 
    include: { _count: { select: { bookings: true } } }, 
  }); 
} 

export async function getEventTypeById(id: string, userId: string) { 
  const eventType = await prisma.eventType.findUnique({ 
    where: { id }, 
    include: { _count: { select: { bookings: true } } }, 
  }); 

  if (!eventType) throw new NotFoundError('Event type not found'); 
  if (eventType.userId !== userId) throw new ForbiddenError(); 

  return eventType; 
} 

export async function createEventType(input: CreateEventTypeInput) { 
  const { title, description, slug, duration, color, userId } = input; 

  const normalizedSlug = slug.toLowerCase().replace(/\s+/g, '-'); 

  const existing = await prisma.eventType.findUnique({ 
    where: { userId_slug: { userId, slug: normalizedSlug } }, 
  }); 
  if (existing) 
    throw new ConflictError('You already have an event type with this slug'); 

  return prisma.eventType.create({ 
    data: { 
      title, 
      description, 
      slug: normalizedSlug, 
      duration, 
      color: color || '#6366f1', 
      userId, 
    }, 
  }); 
} 

export async function updateEventType( 
  id: string, 
  userId: string, 
  data: UpdateEventTypeInput 
) { 
  const eventType = await prisma.eventType.findUnique({ where: { id } }); 
  if (!eventType) throw new NotFoundError('Event type not found'); 
  if (eventType.userId !== userId) throw new ForbiddenError(); 

  if (data.slug && data.slug !== eventType.slug) { 
    const normalizedSlug = data.slug.toLowerCase().replace(/\s+/g, '-'); 
    const existing = await prisma.eventType.findUnique({ 
      where: { userId_slug: { userId, slug: normalizedSlug } }, 
    }); 
    if (existing) 
      throw new ConflictError('You already have an event type with this slug'); 
    data.slug = normalizedSlug; 
  } 

  return prisma.eventType.update({ where: { id }, data }); 
} 

export async function deleteEventType(id: string, userId: string) { 
  const eventType = await prisma.eventType.findUnique({ where: { id } }); 
  if (!eventType) throw new NotFoundError('Event type not found'); 
  if (eventType.userId !== userId) throw new ForbiddenError(); 

  await prisma.eventType.delete({ where: { id } }); 
} 
