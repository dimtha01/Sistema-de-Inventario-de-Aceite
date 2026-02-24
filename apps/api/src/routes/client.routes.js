import { Router } from 'express';
import { getClientes, createCliente } from '../controllers/client.controller.js';

const router = Router();

router.use((req, res, next) => {
    console.log("ENTRANDO A CLIENT ROUTES:", req.method, req.url);
    next();
});

router.get('/', getClientes);
router.post('/', createCliente);
router.get('', getClientes); // just in case
router.post('', createCliente);

export default router;
