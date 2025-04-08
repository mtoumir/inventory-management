/*
  Warnings:

  - You are about to drop the column `type` on the `Materials` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `Materials` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to alter the column `quantity` on the `Productions` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - The primary key for the `ProductionsHistory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `historyId` on the `ProductionsHistory` table. All the data in the column will be lost.
  - You are about to alter the column `quantity` on the `Sorties` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.
  - You are about to drop the `SortiesHistory` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `productionSummaryId` to the `ProductionsHistory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `productiontotalQuantity` to the `ProductionsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Materials" DROP COLUMN "type",
ADD COLUMN     "typeArticle" TEXT,
ALTER COLUMN "designation" DROP NOT NULL,
ALTER COLUMN "unit" DROP NOT NULL,
ALTER COLUMN "PU" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL,
ALTER COLUMN "quantity" SET DATA TYPE INTEGER,
ALTER COLUMN "cout" DROP NOT NULL,
ALTER COLUMN "imputation" DROP NOT NULL,
ALTER COLUMN "desImputation" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Productions" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "ProductionsHistory" DROP CONSTRAINT "ProductionsHistory_pkey",
DROP COLUMN "historyId",
ADD COLUMN     "productionSummaryId" TEXT NOT NULL,
ADD COLUMN     "productiontotalQuantity" INTEGER NOT NULL,
ADD CONSTRAINT "ProductionsHistory_pkey" PRIMARY KEY ("productionSummaryId");

-- AlterTable
ALTER TABLE "Sorties" ALTER COLUMN "quantity" SET DATA TYPE INTEGER;

-- DropTable
DROP TABLE "SortiesHistory";

-- CreateTable
CREATE TABLE "SortiesSummary" (
    "sortieSummaryId" TEXT NOT NULL,
    "sortietotalQuantity" INTEGER NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SortiesSummary_pkey" PRIMARY KEY ("sortieSummaryId")
);
