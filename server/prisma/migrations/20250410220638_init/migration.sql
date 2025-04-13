/*
  Warnings:

  - You are about to drop the column `productiontotalQuantity` on the `ProductionsSummary` table. All the data in the column will be lost.
  - You are about to drop the column `sortietotalQuantity` on the `SortiesSummary` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProductionsSummary" DROP COLUMN "productiontotalQuantity",
ADD COLUMN     "productionTotalQuantity" INTEGER;

-- AlterTable
ALTER TABLE "SortiesSummary" DROP COLUMN "sortietotalQuantity",
ADD COLUMN     "sortieTotalQuantity" INTEGER;
