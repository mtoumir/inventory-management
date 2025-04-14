import { Router } from 'express';
import { createSortie, getSorties } from "../controllers/sortieController"; ;

const router = Router();

// Route to create a sortie
router.post('/', createSortie);
// Route to get all sorties with related material and user
router.get('/', getSorties);

export default router;