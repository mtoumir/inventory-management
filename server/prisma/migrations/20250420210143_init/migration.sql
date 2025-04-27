-- CreateTable
CREATE TABLE "shiftsdefaut" (
    "id" SERIAL NOT NULL,
    "shiftName" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "category" TEXT,
    "problem" TEXT,
    "numbWasted" INTEGER,

    CONSTRAINT "shiftsdefaut_pkey" PRIMARY KEY ("id")
);
