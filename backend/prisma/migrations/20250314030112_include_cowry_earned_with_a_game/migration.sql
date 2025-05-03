/*
  Warnings:

  - You are about to drop the `_PotPlayers` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "_PotPlayers" DROP CONSTRAINT "_PotPlayers_A_fkey";

-- DropForeignKey
ALTER TABLE "_PotPlayers" DROP CONSTRAINT "_PotPlayers_B_fkey";

-- AlterTable
ALTER TABLE "Game" ADD COLUMN     "cowriesEarned" DOUBLE PRECISION NOT NULL DEFAULT 0;

-- DropTable
DROP TABLE "_PotPlayers";
