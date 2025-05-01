import {Request, Response} from 'express';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export const getMaterials = async (req: Request, res: Response): Promise<void> => {
    try {
        const search = req.query.search?.toString();
        const materials = await prisma.materials.findMany({
            where: {
                codeSAP: {
                    contains: search,
                },
            },
        });
        res.json(materials);
    } catch (error) {
        res.status(500).json({ message : 'Error fetching materials' });
    }
};

export const createMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { codeSAP, designation, unit, typeArticle, PU, quantity, cout, imputation, desImputation } = req.body;
        const material = await prisma.materials.create({
            data: {
                codeSAP,
                designation,
                unit,
                typeArticle,
                PU,
                quantity,
                cout,
                imputation,
                desImputation,
            },
        });
        res.status(201).json(material);
    } catch (error) {
        res.status(500).json({ message: 'Error creating material' });
    }
};

export const updateMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { codeSAP } = req.params;
        const { designation, unit, typeArticle, PU, quantity, cout, imputation, desImputation } = req.body;
        const material = await prisma.materials.update({
            where: { codeSAP },
            data: {
                codeSAP,
                designation,
                unit,
                typeArticle,
                PU,
                quantity,
                cout,
                imputation,
                desImputation,
            },
        });
        res.json(material);
    } catch (error) {
        res.status(500).json({ message: 'Error updating material' });
    }
}

export const deleteMaterial = async (req: Request, res: Response): Promise<void> => {
    try {
        const { codeSAP } = req.params;
        await prisma.materials.delete({
            where: { codeSAP},
        });
        res.status(204).send();
    } catch (error) {
        res.status(500).json({ message: 'Error deleting material' });
    }
}
