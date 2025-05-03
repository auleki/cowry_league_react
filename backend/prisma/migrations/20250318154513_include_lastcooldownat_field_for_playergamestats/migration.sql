-- AlterTable
ALTER TABLE "PlayerGameStats" ADD COLUMN     "lastCooldownStartAt" TIMESTAMP(3),
ADD COLUMN     "maxLives" INTEGER NOT NULL DEFAULT 3;
