import { Router } from 'express'; 
import { z } from 'zod'; 
import { validate } from '../middleware/validate.js'; 
import { authenticate } from '../middleware/auth.js'; 
import * as eventTypeController from '../controllers/eventTypeController.js'; 

export const eventTypesRouter = Router(); 

eventTypesRouter.use(authenticate); 

const createSchema = z.object({ 
  body: z.object({ 
    title: z.string().min(1, 'Title is required').max(100), 
    description: z.string().max(500).optional(), 
    slug: z 
      .string() 
      .min(1, 'Slug is required') 
      .max(50) 
      .regex( 
        /^[a-z0-9-]+$/, 
        'Slug can only contain lowercase letters, numbers, and hyphens' 
      ), 
    duration: z 
      .number() 
      .int() 
      .min(5, 'Duration must be at least 5 minutes') 
      .max(480, 'Duration cannot exceed 8 hours'), 
    color: z 
      .string() 
      .regex(/^#[0-9A-Fa-f]{6}$/) 
      .optional(), 
  }), 
}); 

const updateSchema = z.object({ 
  params: z.object({ id: z.string().uuid() }), 
  body: z.object({ 
    title: z.string().min(1).max(100).optional(), 
    description: z.string().max(500).optional(), 
    slug: z 
      .string() 
      .min(1) 
      .max(50) 
      .regex(/^[a-z0-9-]+$/) 
      .optional(), 
    duration: z.number().int().min(5).max(480).optional(), 
    color: z 
      .string() 
      .regex(/^#[0-9A-Fa-f]{6}$/) 
      .optional(), 
    isActive: z.boolean().optional(), 
  }), 
}); 

const idSchema = z.object({ 
  params: z.object({ id: z.string().uuid() }), 
}); 

eventTypesRouter.get('/', eventTypeController.getEventTypes); 
eventTypesRouter.get('/:id', validate(idSchema), eventTypeController.getEventType); 
eventTypesRouter.post('/', validate(createSchema), eventTypeController.createEventType); 
eventTypesRouter.put('/:id', validate(updateSchema), eventTypeController.updateEventType); 
eventTypesRouter.delete('/:id', validate(idSchema), eventTypeController.deleteEventType); 
