/*
  Warnings:

  - You are about to alter the column `totalSupply` on the `Cowry` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - The primary key for the `CowryTransactions` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to alter the column `id` on the `CowryTransactions` table. The data in that column could be lost. The data in that column will be cast from `BigInt` to `Integer`.
  - You are about to drop the `FiatTransactions` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "FiatTransactions" DROP CONSTRAINT "FiatTransactions_playerId_fkey";

-- AlterTable
ALTER TABLE "Cowry" ALTER COLUMN "totalSupply" SET DATA TYPE INTEGER;

-- AlterTable
ALTER TABLE "CowryTransactions" DROP CONSTRAINT "CowryTransactions_pkey",
ALTER COLUMN "id" SET DATA TYPE INTEGER,
ALTER COLUMN "id" SET DEFAULT nextval('"CowryTransactions"'::regclass),
ADD CONSTRAINT "CowryTransactions_pkey" PRIMARY KEY ("id");

-- DropTable
DROP TABLE "FiatTransactions";

-- CreateTable
CREATE TABLE "NairaFiatTransactions" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "reference" TEXT NOT NULL,
    "accessCode" TEXT NOT NULL,
    "authorizationUrl" TEXT NOT NULL,
    "transactionType" TEXT NOT NULL,
    "status" TEXT NOT NULL,

    CONSTRAINT "NairaFiatTransactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "NairaFiatTransactions" ADD CONSTRAINT "NairaFiatTransactions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
