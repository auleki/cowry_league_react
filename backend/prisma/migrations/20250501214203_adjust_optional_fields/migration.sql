/*
  Warnings:

  - You are about to drop the column `transactionId` on the `Cowry` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Cowry" DROP COLUMN "transactionId",
ALTER COLUMN "totalSupply" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "CowryTransactions" ALTER COLUMN "amount" SET DATA TYPE DOUBLE PRECISION;
