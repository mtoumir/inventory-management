/*
  Warnings:

  - You are about to drop the column `codeSAP` on the `Productions` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[codeSAP]` on the table `Materials` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Productions" DROP COLUMN "codeSAP";

-- CreateIndex
CREATE UNIQUE INDEX "Materials_codeSAP_key" ON "Materials"("codeSAP");
