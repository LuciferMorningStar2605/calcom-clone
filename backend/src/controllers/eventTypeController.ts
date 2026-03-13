import { Response } from 'express'; 
import * as eventTypeService from '../services/eventTypeService.js'; 
import { AuthRequest } from '../middleware/auth.js'; 
import { sendSuccess, sendCreated, sendNoContent } from '../utils/response.js'; 

export async function getEventTypes( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const eventTypes = await eventTypeService.getEventTypesByUser(req.user!.id); 
  sendSuccess(res, eventTypes); 
} 

export async function getEventType( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const eventType = await eventTypeService.getEventTypeById( 
    req.params.id, 
    req.user!.id 
  ); 
  sendSuccess(res, eventType); 
} 

export async function createEventType( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const { title, description, slug, duration, color } = req.body; 
  const eventType = await eventTypeService.createEventType({ 
    title, 
    description, 
    slug, 
    duration, 
    color, 
    userId: req.user!.id, 
  }); 
  sendCreated(res, eventType, 'Event type created'); 
} 

export async function updateEventType( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const { title, description, slug, duration, color, isActive } = req.body; 
  const eventType = await eventTypeService.updateEventType( 
    req.params.id, 
    req.user!.id, 
    { title, description, slug, duration, color, isActive } 
  ); 
  sendSuccess(res, eventType, 200, 'Event type updated'); 
} 

export async function deleteEventType( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  await eventTypeService.deleteEventType(req.params.id, req.user!.id); 
  sendNoContent(res); 
} 
