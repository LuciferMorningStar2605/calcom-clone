import { Request, Response } from 'express'; 
import * as publicService from '../services/publicService.js'; 
import { sendSuccess } from '../utils/response.js'; 

export async function getPublicEventType( 
  req: Request, 
  res: Response 
): Promise<void> { 
  const { username, slug } = req.params; 
  const data = await publicService.getPublicEventType(username, slug); 
  sendSuccess(res, data); 
} 

export async function getPublicUserPage( 
  req: Request, 
  res: Response 
): Promise<void> { 
  const { username } = req.params; 
  const data = await publicService.getPublicUserEventTypes(username); 
  sendSuccess(res, data); 
} 
