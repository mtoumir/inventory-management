import express from 'express';
import { createProduction, getProductions, updateProduction } from '../controllers/productionController';

const router = express.Router();

router.post('/', createProduction);
router.get('/', getProductions);
router.put('/:id', updateProduction);


export default router;