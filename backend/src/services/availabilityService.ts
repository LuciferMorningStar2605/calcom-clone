import { prisma } from '../lib/prisma'; 

interface AvailabilityInput { 
  dayOfWeek: number; 
  startTime: string; 
  endTime: string; 
  timezone: string; 
} 

export async function getAvailability(userId: string) { 
  return prisma.availability.findMany({ 
    where: { userId }, 
    orderBy: { dayOfWeek: 'asc' }, 
  }); 
} 

export async function upsertAvailability( 
  userId: string, 
  slots: AvailabilityInput[] 
) { 
  // Delete all existing, then recreate — simple and safe 
  await prisma.availability.deleteMany({ where: { userId } }); 

  if (slots.length > 0) { 
    await prisma.availability.createMany({ 
      data: slots.map((slot) => ({ 
        userId, 
        dayOfWeek: slot.dayOfWeek, 
        startTime: slot.startTime, 
        endTime: slot.endTime, 
        timezone: slot.timezone, 
      })), 
    }); 
  } 

  return prisma.availability.findMany({ 
    where: { userId }, 
    orderBy: { dayOfWeek: 'asc' }, 
  }); 
} 
