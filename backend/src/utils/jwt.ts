import jwt from 'jsonwebtoken'; 
import { UnauthorizedError } from './errors'; 

interface TokenPayload { 
  userId: string; 
  email: string; 
} 

export function signToken(payload: TokenPayload): string { 
  const secret = process.env.JWT_SECRET; 
  if (!secret) throw new Error('JWT_SECRET not configured'); 

  return jwt.sign(payload, secret, { 
    expiresIn: process.env.JWT_EXPIRES_IN || '7d', 
  } as jwt.SignOptions); 
} 

export function verifyToken(token: string): TokenPayload { 
  const secret = process.env.JWT_SECRET; 
  if (!secret) throw new Error('JWT_SECRET not configured'); 

  try { 
    return jwt.verify(token, secret) as TokenPayload; 
  } catch { 
    throw new UnauthorizedError('Invalid or expired token'); 
  } 
} 
