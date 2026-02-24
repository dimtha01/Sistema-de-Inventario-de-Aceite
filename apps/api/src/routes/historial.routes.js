import { Router } from 'express';
import { getHistorial } from '../controllers/historial.controller.js';

const router = Router();

router.get('/', getHistorial);

export default router;
