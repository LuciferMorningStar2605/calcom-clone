import { Router } from 'express'; 
import { z } from 'zod'; 
import { validate } from '../middleware/validate'; 
import { authenticate } from '../middleware/auth'; 
import * as availabilityController from '../controllers/availabilityController'; 

export const availabilityRouter = Router(); 

availabilityRouter.use(authenticate); 

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/; 

const upsertSchema = z.object({ 
  body: z.object({ 
    slots: z 
      .array( 
        z.object({ 
          dayOfWeek: z.number().int().min(0).max(6), 
          startTime: z 
            .string() 
            .regex(timeRegex, 'Start time must be in HH:MM format'), 
          endTime: z 
            .string() 
            .regex(timeRegex, 'End time must be in HH:MM format'), 
          timezone: z.string().min(1, 'Timezone is required'), 
        }) 
      ) 
      .min(0) 
      .max(7), 
  }), 
}); 

availabilityRouter.get('/', availabilityController.getAvailability); 
availabilityRouter.post( 
  '/', 
  validate(upsertSchema), 
  availabilityController.upsertAvailability 
); 
