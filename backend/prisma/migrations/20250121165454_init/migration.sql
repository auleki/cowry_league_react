/*
  Warnings:

  - You are about to drop the column `potsJoined` on the `Player` table. All the data in the column will be lost.
  - You are about to drop the column `potSize` on the `Pot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Player" DROP COLUMN "potsJoined";

-- AlterTable
ALTER TABLE "Pot" DROP COLUMN "potSize";
