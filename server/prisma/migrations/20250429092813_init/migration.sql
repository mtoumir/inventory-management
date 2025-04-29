/*
  Warnings:

  - You are about to drop the `shiftsdefaut` table. If the table is not empty, all the data it contains will be lost.

*/
-- CreateEnum
CREATE TYPE "ShiftType" AS ENUM ('MORNING', 'MIDDAY', 'NIGHT');

-- CreateEnum
CREATE TYPE "CategoryType" AS ENUM ('PRODUCTION', 'MAINTENANCE', 'OTHER');

-- CreateEnum
CREATE TYPE "ProblemType" AS ENUM ('MACHINE', 'MATERIAL', 'OTHER');

-- DropTable
DROP TABLE "shiftsdefaut";

-- CreateTable
CREATE TABLE "Shift" (
    "id" TEXT NOT NULL,
    "shiftType" "ShiftType" NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "technicien" TEXT,
    "totalWasted" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Shift_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WastedEntry" (
    "id" TEXT NOT NULL,
    "category" "CategoryType" NOT NULL,
    "problem" "ProblemType" NOT NULL,
    "Quantity" INTEGER NOT NULL,
    "shiftId" TEXT NOT NULL,

    CONSTRAINT "WastedEntry_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WastedEntry" ADD CONSTRAINT "WastedEntry_shiftId_fkey" FOREIGN KEY ("shiftId") REFERENCES "Shift"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
