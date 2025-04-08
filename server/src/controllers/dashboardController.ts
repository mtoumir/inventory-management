import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const getDashboardMetrics = async (req: Request, res: Response): Promise<void> => {
    try {
        const popularMaterials = await prisma.materials.findMany({
            take: 15,
            orderBy: {
                quantity: "desc",
            },
        });
        const sortieSummary = await prisma.sortiesSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });
        const productionSummary = await prisma.productionsSummary.findMany({
            take: 5,
            orderBy: {
                date: "desc",
            },
        });

        res.json({
            popularMaterials,
            sortieSummary,
            productionSummary,
        });

    } catch (error) {
        res.status(500).json({ message: "error retrieving dashboard metrics" });
    }
}
