/*
  Warnings:

  - You are about to drop the `ProductionsHistory` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "ProductionsHistory";

-- CreateTable
CREATE TABLE "ProductionsSummary" (
    "productionSummaryId" TEXT NOT NULL,
    "productiontotalQuantity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionsSummary_pkey" PRIMARY KEY ("productionSummaryId")
);
