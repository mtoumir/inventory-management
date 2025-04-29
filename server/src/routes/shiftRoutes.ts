import express from 'express';
import { createShift, getShifts, deleteShift } from '../controllers/shiftController';

const router = express.Router();

// Route to create a shift record
router.post('/', createShift);

// Route to get all shift records
router.get('/', getShifts);
router.delete('/:id', deleteShift);


// Route to get shift records for a specific shift (1, 2, or 3)
export default router;
