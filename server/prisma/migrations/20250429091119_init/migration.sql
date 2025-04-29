/*
  Warnings:

  - You are about to drop the column `numbWasted` on the `shiftsdefaut` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "shiftsdefaut" DROP COLUMN "numbWasted",
ADD COLUMN     "totalWasted" INTEGER;
