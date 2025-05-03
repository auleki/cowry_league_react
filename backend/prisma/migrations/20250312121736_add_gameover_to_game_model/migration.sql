/*
  Warnings:

  - You are about to drop the column `playerId` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `isOpen` on the `Pot` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "playerId",
ADD COLUMN     "gameover" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Pot" DROP COLUMN "isOpen";
