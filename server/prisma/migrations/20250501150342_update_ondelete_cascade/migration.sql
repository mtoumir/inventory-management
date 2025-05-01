-- DropForeignKey
ALTER TABLE "Productions" DROP CONSTRAINT "Productions_sortieId_fkey";

-- AddForeignKey
ALTER TABLE "Productions" ADD CONSTRAINT "Productions_sortieId_fkey" FOREIGN KEY ("sortieId") REFERENCES "Sorties"("sortieId") ON DELETE CASCADE ON UPDATE CASCADE;
