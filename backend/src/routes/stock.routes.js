import express from 'express';
import {
  inbound,
  outbound,
  transfer,
  opname,
} from '../controllers/stock.controller.js';

const router = express.Router();

router.post('/inbound', inbound);
router.post('/outbound', outbound);
router.post('/transfer', transfer);
router.post('/opname', opname);

export default router;

