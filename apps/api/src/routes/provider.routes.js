import { Router } from 'express';
import { getProviders, createProvider } from '../controllers/provider.controller.js';

const router = Router();

router.get('/', getProviders);
router.post('/', createProvider);

export default router;
