-- DropForeignKey
ALTER TABLE "Game" DROP CONSTRAINT "Game_potId_fkey";

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_potId_fkey" FOREIGN KEY ("potId") REFERENCES "Pot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
