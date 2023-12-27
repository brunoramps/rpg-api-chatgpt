import express from 'express';
import { createCharacterController, levelUp, equipItem, unequipItem } from '../controllers/characterController.js';

const router = express.Router();

router.post('/create', createCharacterController);
router.post('/levelup', levelUp);
router.post('/equip-item', equipItem);
router.post('/unequip-item', unequipItem);

export default router;
