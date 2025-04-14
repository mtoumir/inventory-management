import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// ✅ Add a sortie and decrement material quantity
export const createSortie = async (req: Request, res: Response): Promise<void> => {
  try {
    const { codeSAP, quantity, userName } = req.body;

    if (!codeSAP || !quantity || !userName) {
      res.status(400).json({ error: 'codeSAP, quantity and userName are required' });
      return;
    }

    // 1. Find the material
    const material = await prisma.materials.findUnique({
      where: { codeSAP },
    });

    if (!material) {
      res.status(404).json({ error: 'Material not found' });
      return;
    }

    if (!material.quantity || material.quantity < quantity) {
      res.status(400).json({ error: 'Not enough stock in material' });
      return;
    }

    // 2. Create the sortie
    const sortie = await prisma.sorties.create({
      data: {
        codeSAP,
        quantity,
        userName,
      },
    });

    // 3. Decrement material quantity
    await prisma.materials.update({
      where: { codeSAP },
      data: {
        quantity: {
          decrement: quantity,
        },
      },
    });

    res.status(201).json(sortie);
  } catch (err) {
    console.error('Error creating sortie:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

// ✅ Get all sorties with related material and production info
export const getSorties = async (req: Request, res: Response): Promise<void> => {
  try {
    const sorties = await prisma.sorties.findMany({
      include: {
        material: true,
        productions: true,
      },
      orderBy: {
        timeStamp: 'desc',
      },
    });

    res.status(200).json(sorties);
  } catch (error) {
    console.error('Error fetching sorties:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
};
