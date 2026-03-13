import { Request, Response } from 'express'; 
import * as authService from '../services/authService.js'; 
import { AuthRequest } from '../middleware/auth.js'; 
import { sendSuccess, sendCreated } from '../utils/response.js'; 

export async function register(req: Request, res: Response): Promise<void> { 
  const { name, email, username, password, timezone } = req.body; 
  const result = await authService.registerUser({ 
    name, 
    email, 
    username, 
    password, 
    timezone, 
  }); 
  sendCreated(res, result, 'Account created successfully'); 
} 

export async function login(req: Request, res: Response): Promise<void> { 
  const { email, password } = req.body; 
  const result = await authService.loginUser({ email, password }); 
  sendSuccess(res, result, 200, 'Login successful'); 
} 

export async function getMe(req: AuthRequest, res: Response): Promise<void> { 
  const user = await authService.getUserProfile(req.user!.id); 
  sendSuccess(res, user); 
} 

export async function updateMe( 
  req: AuthRequest, 
  res: Response 
): Promise<void> { 
  const { name, bio, timezone, username } = req.body; 
  const user = await authService.updateUserProfile(req.user!.id, { 
    name, 
    bio, 
    timezone, 
    username, 
  }); 
  sendSuccess(res, user, 200, 'Profile updated'); 
} 
