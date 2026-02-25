import { Router } from 'express';
import { getProducts, createProduct, getFormOptions, updateProduct, getLowStockAlerts } from '../controllers/inventory.controller.js';
import { uploadProductImage } from '../middlewares/uploadImage.js';

const router = Router();

router.get('/products', getProducts);
router.post('/products', uploadProductImage.single("image"), createProduct);
router.get('/options', getFormOptions);
router.put("/products/:id", uploadProductImage.single('image'), updateProduct);
router.get('/alerts', getLowStockAlerts);

export default router;
