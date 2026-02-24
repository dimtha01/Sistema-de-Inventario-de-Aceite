import { Router } from 'express';
import { getPosData, createVenta } from '../controllers/pos.controller.js';

const router = Router();

router.get('/data', getPosData);
router.post('/venta', createVenta);

export default router;
