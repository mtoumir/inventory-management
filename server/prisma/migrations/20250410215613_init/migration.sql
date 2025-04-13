/*
  Warnings:

  - You are about to drop the column `changePercentage` on the `ProductionsSummary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductionsSummary" DROP COLUMN "changePercentage",
ADD COLUMN     "productionChangePercentage" DOUBLE PRECISION;
