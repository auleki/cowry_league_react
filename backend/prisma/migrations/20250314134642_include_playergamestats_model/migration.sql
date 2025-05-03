/*
  Warnings:

  - You are about to drop the column `cowriesEarned` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `livesLeft` on the `Game` table. All the data in the column will be lost.
  - You are about to drop the column `currentPot` on the `Player` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Game" DROP COLUMN "cowriesEarned",
DROP COLUMN "livesLeft";

-- AlterTable
ALTER TABLE "Player" DROP COLUMN "currentPot";

-- CreateTable
CREATE TABLE "PlayerGameStats" (
    "id" SERIAL NOT NULL,
    "gameId" INTEGER NOT NULL,
    "playerId" INTEGER NOT NULL,
    "cowriesEarned" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "livesLeft" INTEGER NOT NULL DEFAULT 3,

    CONSTRAINT "PlayerGameStats_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PlayerGameStats_gameId_playerId_key" ON "PlayerGameStats"("gameId", "playerId");

-- AddForeignKey
ALTER TABLE "PlayerGameStats" ADD CONSTRAINT "PlayerGameStats_gameId_fkey" FOREIGN KEY ("gameId") REFERENCES "Game"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "PlayerGameStats" ADD CONSTRAINT "PlayerGameStats_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
