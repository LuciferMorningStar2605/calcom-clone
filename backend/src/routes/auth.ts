import { Router } from 'express'; 
import { z } from 'zod'; 
import { validate } from '../middleware/validate'; 
import { authenticate } from '../middleware/auth'; 
import * as authController from '../controllers/authController'; 

export const authRouter = Router(); 

const registerSchema = z.object({ 
  body: z.object({ 
    name: z.string().min(2, 'Name must be at least 2 characters'), 
    email: z.string().email('Invalid email address'), 
    username: z 
      .string() 
      .min(3, 'Username must be at least 3 characters') 
      .max(30) 
      .regex( 
        /^[a-zA-Z0-9_-]+$/, 
        'Username can only contain letters, numbers, hyphens, and underscores' 
      ), 
    password: z.string().min(8, 'Password must be at least 8 characters'), 
    timezone: z.string().optional(), 
  }), 
}); 

const loginSchema = z.object({ 
  body: z.object({ 
    email: z.string().email('Invalid email address'), 
    password: z.string().min(1, 'Password is required'), 
  }), 
}); 

const updateProfileSchema = z.object({ 
  body: z.object({ 
    name: z.string().min(2).optional(), 
    bio: z.string().max(500).optional(), 
    timezone: z.string().optional(), 
    username: z 
      .string() 
      .min(3) 
      .max(30) 
      .regex(/^[a-zA-Z0-9_-]+$/) 
      .optional(), 
  }), 
}); 

authRouter.post('/register', validate(registerSchema), authController.register); 
authRouter.post('/login', validate(loginSchema), authController.login); 
authRouter.get('/me', authenticate, authController.getMe); 
authRouter.put( 
  '/me', 
  authenticate, 
  validate(updateProfileSchema), 
  authController.updateMe 
); 
