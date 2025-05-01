import { Router } from 'express';
import { createSortie, getSorties, deleteSortie } from "../controllers/sortieController"; ;

const router = Router();

// Route to create a sortie
router.post('/', createSortie);
// Route to get all sorties with related material and user
router.get('/', getSorties);
// Route to delete a sortie by ID
router.delete('/:id', deleteSortie);

export default router;