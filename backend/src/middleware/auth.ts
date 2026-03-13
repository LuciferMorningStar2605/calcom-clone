import { Request, Response, NextFunction } from 'express'; 
import { verifyToken } from '../utils/jwt'; 
import { UnauthorizedError } from '../utils/errors'; 
import { prisma } from '../lib/prisma'; 

export interface AuthRequest extends Request { 
  user?: { 
    id: string; 
    email: string; 
    name: string; 
    username: string; 
    timezone: string; 
  }; 
} 

export async function authenticate( 
  req: AuthRequest, 
  _res: Response, 
  next: NextFunction 
): Promise<void> { 
  const authHeader = req.headers.authorization; 

  if (!authHeader?.startsWith('Bearer ')) { 
    throw new UnauthorizedError('No token provided'); 
  } 

  const token = authHeader.substring(7); 
  const payload = verifyToken(token); 

  const user = await prisma.user.findUnique({ 
    where: { id: payload.userId }, 
    select: { 
      id: true, 
      email: true, 
      name: true, 
      username: true, 
      timezone: true, 
    }, 
  }); 

  if (!user) { 
    throw new UnauthorizedError('User not found'); 
  } 

  req.user = user; 
  next(); 
} 
