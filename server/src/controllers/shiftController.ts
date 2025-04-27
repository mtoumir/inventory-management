import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const createShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shift, timeStamp, category, problem, numbWasted } = req.body;
    if (!shift || !timeStamp || !category || numbWasted === undefined) {
      res.status(400).json({ error: 'shift, timeStamp, category and numbWasted are required' });
      return;
    }
    const newShift = await prisma.shiftsdefaut.create({
      data: {
        shift,
        timeStamp: new Date(timeStamp),
        category,
        problem,
        numbWasted,
      },
    });
    res.status(201).json(newShift);
  } catch (err) {
    console.error('Error creating shift:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getShifts = async (req: Request, res: Response): Promise<void> => {
  try {
    const shifts = await prisma.shiftsdefaut.findMany();
    res.json(shifts);
  } catch (err) {
    console.error('Error retrieving shifts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};
