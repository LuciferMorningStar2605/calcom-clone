import { parseISO, addMinutes, getDay } from 'date-fns'; 
import { prisma } from '../lib/prisma.js'; 
import { 
  NotFoundError, 
  ConflictError, 
  BadRequestError, 
  ForbiddenError, 
} from '../utils/errors.js'; 
import { generateTimeSlots } from '../utils/slots.js'; 

const BookingStatus = {
  CONFIRMED: 'CONFIRMED',
  CANCELLED: 'CANCELLED',
  COMPLETED: 'COMPLETED',
} as const;
type BookingStatus = (typeof BookingStatus)[keyof typeof BookingStatus];

interface CreateBookingInput { 
  eventTypeId: string; 
  guestName: string; 
  guestEmail: string; 
  startTime: string; 
  notes?: string; 
} 

export async function getBookingsByUser( 
  userId: string, 
  filter?: 'upcoming' | 'past' | 'cancelled' 
) { 
  const now = new Date(); 

  type WhereClause = { 
    eventType: { userId: string }; 
    startTime?: { gte?: Date; lt?: Date }; 
    status?: BookingStatus | { not: BookingStatus }; 
    OR?: Array<{ 
      startTime?: { lt: Date }; 
      status?: BookingStatus; 
    }>; 
  }; 

  let where: WhereClause = { eventType: { userId } }; 

  if (filter === 'upcoming') { 
    where = { 
      ...where, 
      startTime: { gte: now }, 
      status: BookingStatus.CONFIRMED, 
    }; 
  } else if (filter === 'past') { 
    where = { 
      ...where, 
      OR: [ 
        { startTime: { lt: now }, status: BookingStatus.CONFIRMED }, 
        { status: BookingStatus.COMPLETED }, 
      ], 
    } as WhereClause; 
  } else if (filter === 'cancelled') { 
    where = { ...where, status: BookingStatus.CANCELLED }; 
  } 

  return prisma.booking.findMany({ 
    where, 
    include: { 
      eventType: { 
        select: { 
          title: true, 
          duration: true, 
          color: true, 
          slug: true, 
        }, 
      }, 
    }, 
    orderBy: { startTime: filter === 'past' ? 'desc' : 'asc' }, 
  }); 
} 

export async function getAvailableSlotsForDate( 
  eventTypeId: string, 
  date: string 
) { 
  const eventType = await prisma.eventType.findUnique({ 
    where: { id: eventTypeId }, 
    include: { 
      user: { 
        include: { availability: true }, 
      }, 
    }, 
  }); 

  if (!eventType) throw new NotFoundError('Event type not found'); 
  if (!eventType.isActive) 
    throw new BadRequestError('This event type is not active'); 

  const requestedDate = parseISO(date); 
  const dayOfWeek = getDay(requestedDate); 

  const availability = eventType.user.availability.find( 
    (a) => a.dayOfWeek === dayOfWeek 
  ); 

  if (!availability) { 
    return { slots: [], message: 'No availability on this day' }; 
  } 

  const startOfDay = parseISO(`${date}T00:00:00.000Z`); 
  const endOfDay = parseISO(`${date}T23:59:59.999Z`); 

  const bookedSlots = await prisma.booking.findMany({ 
    where: { 
      eventTypeId, 
      startTime: { gte: startOfDay, lte: endOfDay }, 
      status: { not: BookingStatus.CANCELLED }, 
    }, 
    select: { startTime: true, endTime: true }, 
  }); 

  const slots = generateTimeSlots({ 
    date, 
    startTime: availability.startTime, 
    endTime: availability.endTime, 
    duration: eventType.duration, 
    timezone: availability.timezone, 
    bookedSlots, 
  }); 

  return { slots, timezone: availability.timezone }; 
} 

export async function createBooking(input: CreateBookingInput) { 
  const { eventTypeId, guestName, guestEmail, startTime, notes } = input; 

  const eventType = await prisma.eventType.findUnique({ 
    where: { id: eventTypeId }, 
    include: { 
      user: { include: { availability: true } }, 
    }, 
  }); 

  if (!eventType) throw new NotFoundError('Event type not found'); 
  if (!eventType.isActive) 
    throw new BadRequestError('This event type is not active'); 

  const startDateTime = parseISO(startTime); 
  const endDateTime = addMinutes(startDateTime, eventType.duration); 

  // Validate the requested day has availability 
  const dayOfWeek = getDay(startDateTime); 
  const availability = eventType.user.availability.find( 
    (a) => a.dayOfWeek === dayOfWeek 
  ); 
  if (!availability) { 
    throw new BadRequestError('This time is outside of available days'); 
  } 

  // Check for booking conflicts (service-layer check before DB constraint fires) 
  const conflict = await prisma.booking.findFirst({ 
    where: { 
      eventTypeId, 
      status: { not: BookingStatus.CANCELLED }, 
      OR: [ 
        { 
          startTime: { lte: startDateTime }, 
          endTime: { gt: startDateTime }, 
        }, 
        { 
          startTime: { lt: endDateTime }, 
          endTime: { gte: endDateTime }, 
        }, 
        { 
          startTime: { gte: startDateTime }, 
          endTime: { lte: endDateTime }, 
        }, 
      ], 
    }, 
  }); 

  if (conflict) throw new ConflictError('This time slot is already booked'); 

  return prisma.booking.create({ 
    data: { 
      eventTypeId, 
      guestName, 
      guestEmail, 
      startTime: startDateTime, 
      endTime: endDateTime, 
      notes, 
      status: BookingStatus.CONFIRMED, 
    }, 
    include: { 
      eventType: { 
        select: { 
          title: true, 
          duration: true, 
          color: true, 
          user: { 
            select: { name: true, email: true, timezone: true }, 
          }, 
        }, 
      }, 
    }, 
  }); 
} 

export async function cancelBooking(id: string, userId: string) { 
  const booking = await prisma.booking.findUnique({ 
    where: { id }, 
    include: { eventType: true }, 
  }); 

  if (!booking) throw new NotFoundError('Booking not found'); 
  if (booking.eventType.userId !== userId) throw new ForbiddenError(); 
  if (booking.status === BookingStatus.CANCELLED) 
    throw new BadRequestError('Booking is already cancelled'); 

  return prisma.booking.update({ 
    where: { id }, 
    data: { status: BookingStatus.CANCELLED }, 
    include: { 
      eventType: { 
        select: { title: true, duration: true, color: true }, 
      }, 
    }, 
  }); 
} 
