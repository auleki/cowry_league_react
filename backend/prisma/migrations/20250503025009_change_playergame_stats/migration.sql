/*
  Warnings:

  - You are about to drop the column `cowriesEarned` on the `PlayerGameStats` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "PlayerGameStats" DROP COLUMN "cowriesEarned",
ADD COLUMN     "popsEarned" DOUBLE PRECISION NOT NULL DEFAULT 0;
