import express from 'express';
import { startBattle, simulateBattle } from '../controllers/battleController.js';

const router = express.Router();

router.post('/start', startBattle);
router.post('/simulate', simulateBattle);

export default router;
