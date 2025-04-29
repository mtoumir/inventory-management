-- AlterTable
ALTER TABLE "shiftsdefaut" ADD COLUMN     "technicien" TEXT,
ALTER COLUMN "timeStamp" DROP DEFAULT,
ALTER COLUMN "shift" DROP NOT NULL;
