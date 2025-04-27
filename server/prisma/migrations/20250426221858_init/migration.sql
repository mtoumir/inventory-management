/*
  Warnings:

  - The primary key for the `shiftsdefaut` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `id` on the `shiftsdefaut` table. All the data in the column will be lost.
  - The required column `defaultPerShiftId` was added to the `shiftsdefaut` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "shiftsdefaut" DROP CONSTRAINT "shiftsdefaut_pkey",
DROP COLUMN "id",
ADD COLUMN     "defaultPerShiftId" TEXT NOT NULL,
ADD CONSTRAINT "shiftsdefaut_pkey" PRIMARY KEY ("defaultPerShiftId");
