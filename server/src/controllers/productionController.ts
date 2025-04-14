import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

/**
 * Create a production linked to a sortie
 */
export const createProduction = async (req: Request, res: Response): Promise<void> => {
  const { sortieId, quantity, wasteQuantity } = req.body;

  if (!sortieId || quantity === undefined || wasteQuantity === undefined) {
    res.status(400).json({ error: 'Missing required fields: sortieId, quantity, or wasteQuantity' });
    return;
  }

  try {
    const sortie = await prisma.sorties.findUnique({
      where: { sortieId },
    });

    if (!sortie) {
      res.status(404).json({ error: 'Sortie not found' });
      return;
    }

    const production = await prisma.productions.create({
      data: {
        sortieId,
        quantity,
        wasteQuantity,
      },
      include: {
        sortie: {
          include: {
            material: true,
          },
        },
      },
    });

    res.status(201).json(production);
  } catch (err) {
    console.error('Error creating production:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

/**
 * Get all productions with related sortie and material
 */
export const getProductions = async (req: Request, res: Response): Promise<void> => {
  try {
    const productions = await prisma.productions.findMany({
      include: {
        sortie: {
          include: {
            material: true,
          },
        },
      },
      orderBy: {
        timeStamp: 'desc',
      },
    });

    res.status(200).json(productions);
  } catch (err) {
    console.error('Error fetching productions:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateProduction = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;
  const { quantity, wasteQuantity } = req.body;

  if (quantity === undefined || wasteQuantity === undefined) {
    res.status(400).json({ error: 'Both quantity and wasteQuantity are required' });
    return;
  }

  try {
    const existingProduction = await prisma.productions.findUnique({
      where: { productionId: id },
    });

    if (!existingProduction) {
      res.status(404).json({ error: 'Production not found' });
      return;
    }

    const updatedProduction = await prisma.productions.update({
      where: { productionId: id },
      data: {
        quantity,
        wasteQuantity,
      },
      include: {
        sortie: {
          include: {
            material: true,
          },
        },
      },
    });

    res.status(200).json(updatedProduction);
  } catch (err) {
    console.error('Error updating production:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
