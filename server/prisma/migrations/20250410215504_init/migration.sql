-- AlterTable
ALTER TABLE "Productions" ALTER COLUMN "codeSAP" DROP NOT NULL,
ALTER COLUMN "timeStamp" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "ProductionsSummary" ADD COLUMN     "changePercentage" DOUBLE PRECISION,
ALTER COLUMN "productiontotalQuantity" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;

-- AlterTable
ALTER TABLE "Sorties" ALTER COLUMN "timeStamp" DROP NOT NULL,
ALTER COLUMN "quantity" DROP NOT NULL;

-- AlterTable
ALTER TABLE "SortiesSummary" ALTER COLUMN "sortietotalQuantity" DROP NOT NULL,
ALTER COLUMN "date" DROP NOT NULL;
