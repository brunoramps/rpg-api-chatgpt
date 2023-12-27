import express from 'express';
import { createInventoryController, getInventoryController } from '../controllers/inventoryController.js';

const router = express.Router();

// Rota para criar inventário
router.post('/create', createInventoryController);

// Rota para obter inventário
router.get('/get', getInventoryController);

export default router;
