import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const popularMaterials = await prisma.materials.findMany({
            orderBy: {
                quantity: "asc",
            },
            select: {
                codeSAP: true,
                designation: true,
                quantity: true, 
              },
        });

        res.json({
            popularMaterials,
        });

    } catch (error) {
        res.status(500).json({ message: "error retrieving dashboard metrics" });
    }
}
