/*
  Warnings:

  - You are about to drop the column `timeStamp` on the `ProductionsHistory` table. All the data in the column will be lost.
  - Added the required column `date` to the `ProductionsHistory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ProductionsHistory" DROP COLUMN "timeStamp",
ADD COLUMN     "date" TIMESTAMP(3) NOT NULL;
