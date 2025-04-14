/*
  Warnings:

  - You are about to drop the column `userId` on the `Productions` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `Sorties` table. All the data in the column will be lost.
  - You are about to drop the `Users` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "Productions" DROP CONSTRAINT "Productions_userId_fkey";

-- DropForeignKey
ALTER TABLE "Sorties" DROP CONSTRAINT "Sorties_userId_fkey";

-- AlterTable
ALTER TABLE "Productions" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT;

-- AlterTable
ALTER TABLE "Sorties" DROP COLUMN "userId",
ADD COLUMN     "userName" TEXT;

-- DropTable
DROP TABLE "Users";
