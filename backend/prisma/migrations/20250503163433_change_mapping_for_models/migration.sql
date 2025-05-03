/*
  Warnings:

  - You are about to drop the `Cowry` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `CowryTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "CowryTransactions" DROP CONSTRAINT "CowryTransactions_cowryId_fkey";

-- DropForeignKey
ALTER TABLE "CowryTransactions" DROP CONSTRAINT "CowryTransactions_playerId_fkey";

-- DropTable
DROP TABLE "Cowry";

-- DropTable
DROP TABLE "CowryTransactions";

-- CreateTable
CREATE TABLE "cowry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Cowry',
    "totalSupply" INTEGER NOT NULL DEFAULT 0,
    "withdrawalRate" DOUBLE PRECISION NOT NULL DEFAULT 0.88,
    "rateToNaira" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cowry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "cowry_transactions" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionType" TEXT NOT NULL,
    "referenceId" TEXT NOT NULL,
    "cowryId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "cowry_transactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cowry_transactions" ADD CONSTRAINT "cowry_transactions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cowry_transactions" ADD CONSTRAINT "cowry_transactions_cowryId_fkey" FOREIGN KEY ("cowryId") REFERENCES "cowry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
