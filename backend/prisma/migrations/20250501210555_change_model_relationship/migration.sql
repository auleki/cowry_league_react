/*
  Warnings:

  - Added the required column `cowryId` to the `CowryTransactions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Cowry" DROP CONSTRAINT "Cowry_transactionId_fkey";

-- AlterTable
ALTER TABLE "CowryTransactions" ADD COLUMN     "cowryId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "CowryTransactions" ADD CONSTRAINT "CowryTransactions_cowryId_fkey" FOREIGN KEY ("cowryId") REFERENCES "Cowry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
