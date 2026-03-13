import { prisma } from '../lib/prisma'; 
import { NotFoundError } from '../utils/errors'; 

export async function getPublicEventType(username: string, slug: string) { 
  const user = await prisma.user.findUnique({ 
    where: { username }, 
    select: { 
      id: true, 
      name: true, 
      username: true, 
      bio: true, 
      avatarUrl: true, 
      timezone: true, 
      availability: { orderBy: { dayOfWeek: 'asc' } }, 
      eventTypes: { 
        where: { slug, isActive: true }, 
        select: { 
          id: true, 
          title: true, 
          description: true, 
          slug: true, 
          duration: true, 
          color: true, 
        }, 
      }, 
    }, 
  }); 

  if (!user) throw new NotFoundError('User not found'); 

  const eventType = user.eventTypes[0]; 
  if (!eventType) throw new NotFoundError('Event type not found or is inactive'); 

  return { 
    eventType, 
    host: { 
      name: user.name, 
      username: user.username, 
      bio: user.bio, 
      avatarUrl: user.avatarUrl, 
      timezone: user.timezone, 
    }, 
    availability: user.availability, 
  }; 
} 

export async function getPublicUserEventTypes(username: string) { 
  const user = await prisma.user.findUnique({ 
    where: { username }, 
    select: { 
      id: true, 
      name: true, 
      username: true, 
      bio: true, 
      avatarUrl: true, 
      eventTypes: { 
        where: { isActive: true }, 
        select: { 
          id: true, 
          title: true, 
          description: true, 
          slug: true, 
          duration: true, 
          color: true, 
        }, 
        orderBy: { createdAt: 'asc' }, 
      }, 
    }, 
  }); 

  if (!user) throw new NotFoundError('User not found'); 
  return user; 
} 
