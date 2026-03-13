import { Response } from 'express'; 
import * as availabilityService from '../services/availabilityService.js'; 
import { AuthRequest } from '../middleware/auth.js'; 
import { sendSuccess } from '../utils/response.js'; 

export async function getAvailability( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const availability = await availabilityService.getAvailability(req.user!.id); 
  sendSuccess(res, availability); 
} 

export async function upsertAvailability( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const { slots } = req.body; 
  const availability = await availabilityService.upsertAvailability( 
    req.user!.id, 
    slots 
  ); 
  sendSuccess(res, availability, 200, 'Availability updated'); 
} 
