import { Router } from 'express';
import { getProviders, createProvider, deleteProvider } from '../controllers/provider.controller.js';

const router = Router();

router.get('/', getProviders);
router.post('/', createProvider);
router.delete('/:id', deleteProvider);

export default router;
