import { Request, Response } from 'express';
import { PrismaClient, ShiftType, CategoryType, ProblemType } from '@prisma/client';

const prisma = new PrismaClient();

export const createShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { shiftType, ligneType, date, technicien, wastedEntries } = req.body;

    if (!shiftType || !date || !wastedEntries || !Array.isArray(wastedEntries) || wastedEntries.length === 0) {
      res.status(400).json({ error: 'shiftType, date, and at least one wasted entry are required' });
      return;
    }

    const totalWasted = wastedEntries.reduce((sum, entry) => sum + Number(entry.Quantity || 0), 0);

    const newShift = await prisma.shift.create({
      data: {
        shiftType,
        ligneType,
        date: new Date(date),
        technicien,
        totalWasted,
        wastedEntries: {
          create: wastedEntries.map((entry) => ({
            category: entry.category as CategoryType,
            problem: entry.problem as ProblemType,
            Quantity: entry.Quantity,
          })),
        },
      },
      include: {
        wastedEntries: true,
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
    const shifts = await prisma.shift.findMany({
      include: {
        wastedEntries: true,
      },
    });
    res.json(shifts);
  } catch (err) {
    console.error('Error retrieving shifts:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const deleteShift = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    // Check if shift exists
    const existingShift = await prisma.shift.findUnique({
      where: { id },
    });

    if (!existingShift) {
      res.status(404).json({ error: 'Shift not found' });
      return;
    }

    // Delete related wasted entries first (due to foreign key constraint)
    await prisma.wastedEntry.deleteMany({
      where: { shiftId: id },
    });

    // Then delete the shift
    await prisma.shift.delete({
      where: { id },
    });

    res.status(204).send();
  } catch (err) {
    console.error('Error deleting shift:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
};

