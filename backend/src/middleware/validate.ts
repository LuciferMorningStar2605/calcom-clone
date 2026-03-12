import { Request, Response, NextFunction } from 'express'; 
import { AnyZodObject, ZodError } from 'zod'; 

export function validate(schema: AnyZodObject) { 
  return async ( 
    req: Request, 
    res: Response, 
    next: NextFunction 
  ): Promise<void> => { 
    try { 
      await schema.parseAsync({ 
        body: req.body, 
        query: req.query, 
        params: req.params, 
      }); 
      next(); 
    } catch (err) { 
      if (err instanceof ZodError) { 
        const errors = err.errors.map((e) => ({ 
          field: e.path.slice(1).join('.'), 
          message: e.message, 
        })); 
        res.status(400).json({ 
          success: false, 
          error: 'Validation failed', 
          errors, 
        }); 
        return; 
      } 
      next(err); 
    } 
  }; 
} 
