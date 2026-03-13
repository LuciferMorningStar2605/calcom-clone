import { Request, Response, NextFunction } from 'express'; 
import { AppError } from '../utils/errors'; 
import { Prisma } from '@prisma/client'; 
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/library';

export function errorHandler( 
  err: Error, 
  _req: Request, 
  res: Response, 
  _next: NextFunction 
): void { 
  console.error('Error:', err); 

  if (err instanceof AppError) { 
    res.status(err.statusCode).json({ 
      success: false, 
      error: err.message, 
    }); 
    return; 
  } 

  if (err instanceof PrismaClientKnownRequestError) { 
    res.status(400).json({ 
      success: false, 
      error: err.message, 
    }); 
    return; 
  } 

  if (err instanceof Error) { 
    res.status(500).json({ 
      success: false, 
      error: err.message, 
    }); 
    return; 
  }

  res.status(500).json({ 
    success: false, 
    error: 'Internal server error', 
  }); 
} 
