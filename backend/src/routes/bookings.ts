import { Router } from 'express'; 
import { z } from 'zod'; 
import { validate } from '../middleware/validate'; 
import { authenticate } from '../middleware/auth'; 
import * as bookingController from '../controllers/bookingController'; 

export const bookingsRouter = Router(); 

const createBookingSchema = z.object({ 
  body: z.object({ 
    eventTypeId: z.string().uuid('Invalid event type ID'), 
    guestName: z.string().min(1, 'Name is required').max(100), 
    guestEmail: z.string().email('Invalid email address'), 
    startTime: z.string().datetime('Invalid datetime format'), 
    notes: z.string().max(1000).optional(), 
  }), 
}); 

const getSlotsSchema = z.object({ 
  query: z.object({ 
    eventTypeId: z.string().uuid('Invalid event type ID'), 
    date: z 
      .string() 
      .regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'), 
  }), 
}); 

const idSchema = z.object({ 
  params: z.object({ id: z.string().uuid() }), 
}); 

// Public routes (no auth) 
bookingsRouter.get( 
  '/slots', 
  validate(getSlotsSchema), 
  bookingController.getAvailableSlots 
); 
bookingsRouter.post( 
  '/', 
  validate(createBookingSchema), 
  bookingController.createBooking 
); 

// Protected routes 
bookingsRouter.get('/', authenticate, bookingController.getBookings); 
bookingsRouter.delete( 
  '/:id', 
  authenticate, 
  validate(idSchema), 
  bookingController.cancelBooking 
); 
