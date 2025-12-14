import express from 'express';
import { getStockSummary, getValuation, getMovements } from '../controllers/dashboard.controller.js';

const router = express.Router();

router.get('/summary', getStockSummary);
router.get('/valuation', getValuation);
router.get('/movements', getMovements);

export default router;
