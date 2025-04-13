import { Router } from 'express';
import { getMaterials, createMaterial, updateMaterial } from '../controllers/materialController';

const router = Router();

router.get('/', getMaterials);
router.post('/', createMaterial);
router.put('/:codeSAP', updateMaterial);


export default router;