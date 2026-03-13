import { Router } from 'express'; 
import * as publicController from '../controllers/publicController'; 

export const publicRouter = Router(); 

// GET /api/public/:username 
publicRouter.get('/:username', publicController.getPublicUserPage); 

// GET /api/public/:username/:slug 
publicRouter.get('/:username/:slug', publicController.getPublicEventType); 
