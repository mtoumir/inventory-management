import express from 'express';
import { createProduction, getProductions, updateProduction, deleteProduction } from '../controllers/productionController';

const router = express.Router();

router.post('/', createProduction);
router.get('/', getProductions);
router.put('/:id', updateProduction);
router.delete('/:id', deleteProduction);


export default router;