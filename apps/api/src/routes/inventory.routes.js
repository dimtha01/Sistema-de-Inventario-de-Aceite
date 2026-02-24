import { Router } from 'express';
import { getProducts, createProduct, getFormOptions } from '../controllers/inventory.controller.js';
import { uploadProductImage } from '../middlewares/uploadImage.js';

const router = Router();

router.get('/products', getProducts);
router.post('/products', uploadProductImage.single("image"), createProduct);
router.get('/options', getFormOptions);

export default router;
