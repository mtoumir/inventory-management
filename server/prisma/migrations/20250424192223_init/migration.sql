/*
  Warnings:

  - You are about to drop the column `shiftName` on the `shiftsdefaut` table. All the data in the column will be lost.
  - Added the required column `shift` to the `shiftsdefaut` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shiftsdefaut" DROP COLUMN "shiftName",
ADD COLUMN     "shift" INTEGER NOT NULL;
