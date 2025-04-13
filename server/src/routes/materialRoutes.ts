import { Router } from 'express';
import { getMaterials, createMaterial, updateMaterial, deleteMaterial } from '../controllers/materialController';

const router = Router();

router.get('/', getMaterials);
router.post('/', createMaterial);
router.put('/:codeSAP', updateMaterial);
router.delete('/:codeSAP', deleteMaterial);


export default router;