import { Request, Response, NextFunction } from 'express'; 
import { AppError } from '../utils/errors.js'; 
import { Prisma } from '@prisma/client'; 

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

  if (err instanceof Prisma.PrismaClientKnownRequestError) { 
    if (err.code === 'P2002') { 
      res.status(409).json({ 
        success: false, 
        error: 'A record with this value already exists.', 
      }); 
      return; 
    } 
    if (err.code === 'P2025') { 
      res.status(404).json({ 
        success: false, 
        error: 'Record not found.', 
      }); 
      return; 
    } 
  } 

  if (err instanceof Prisma.PrismaClientValidationError) { 
    res.status(400).json({ 
      success: false, 
      error: 'Invalid data provided.', 
    }); 
    return; 
  } 

  res.status(500).json({ 
    success: false, 
    error: 
      process.env.NODE_ENV === 'production' 
        ? 'Internal server error' 
        : err.message, 
  }); 
} 
