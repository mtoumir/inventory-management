-- CreateTable
CREATE TABLE "Users" (
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("userId")
);

-- CreateTable
CREATE TABLE "Materials" (
    "codeSAP" TEXT NOT NULL,
    "designation" TEXT NOT NULL,
    "unit" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "PU" DOUBLE PRECISION NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,
    "cout" DOUBLE PRECISION NOT NULL,
    "imputation" TEXT NOT NULL,
    "desImputation" TEXT NOT NULL,

    CONSTRAINT "Materials_pkey" PRIMARY KEY ("codeSAP")
);

-- CreateTable
CREATE TABLE "Sorties" (
    "sortieId" TEXT NOT NULL,
    "codeSAP" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Sorties_pkey" PRIMARY KEY ("sortieId")
);

-- CreateTable
CREATE TABLE "Productions" (
    "productionId" TEXT NOT NULL,
    "sortieId" TEXT NOT NULL,
    "codeSAP" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,
    "quantity" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "Productions_pkey" PRIMARY KEY ("productionId")
);

-- CreateTable
CREATE TABLE "SortiesHistory" (
    "historyId" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SortiesHistory_pkey" PRIMARY KEY ("historyId")
);

-- CreateTable
CREATE TABLE "ProductionsHistory" (
    "historyId" TEXT NOT NULL,
    "timeStamp" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductionsHistory_pkey" PRIMARY KEY ("historyId")
);

-- AddForeignKey
ALTER TABLE "Sorties" ADD CONSTRAINT "Sorties_codeSAP_fkey" FOREIGN KEY ("codeSAP") REFERENCES "Materials"("codeSAP") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Productions" ADD CONSTRAINT "Productions_sortieId_fkey" FOREIGN KEY ("sortieId") REFERENCES "Sorties"("sortieId") ON DELETE RESTRICT ON UPDATE CASCADE;
