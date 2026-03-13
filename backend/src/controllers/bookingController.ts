import { Request, Response } from 'express'; 
import * as bookingService from '../services/bookingService'; 
import { AuthRequest } from '../middleware/auth'; 
import { sendSuccess, sendCreated } from '../utils/response'; 

export async function getBookings( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const filter = req.query.filter as 
    | 'upcoming' 
    | 'past' 
    | 'cancelled' 
    | undefined; 
  const bookings = await bookingService.getBookingsByUser(req.user!.id, filter); 
  sendSuccess(res, bookings); 
} 

export async function getAvailableSlots( 
  req: Request, 
  res: Response 
): Promise<void> { 
  const { eventTypeId, date } = req.query; 
  const result = await bookingService.getAvailableSlotsForDate( 
    eventTypeId as string, 
    date as string 
  ); 
  sendSuccess(res, result); 
} 

export async function createBooking( 
  req: Request, 
  res: Response 
): Promise<void> { 
  const { eventTypeId, guestName, guestEmail, startTime, notes } = req.body; 
  const booking = await bookingService.createBooking({ 
    eventTypeId, 
    guestName, 
    guestEmail, 
    startTime, 
    notes, 
  }); 
  sendCreated(res, booking, 'Booking confirmed!'); 
} 

export async function cancelBooking( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const booking = await bookingService.cancelBooking( 
    req.params.id, 
    req.user!.id 
  ); 
  sendSuccess(res, booking, 200, 'Booking cancelled'); 
} 
