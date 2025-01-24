-- AlterTable
ALTER TABLE "Pot" ADD COLUMN     "playerId" INTEGER[];

-- CreateTable
CREATE TABLE "_PotPlayers" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PotPlayers_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PotPlayers_B_index" ON "_PotPlayers"("B");

-- AddForeignKey
ALTER TABLE "_PotPlayers" ADD CONSTRAINT "_PotPlayers_A_fkey" FOREIGN KEY ("A") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PotPlayers" ADD CONSTRAINT "_PotPlayers_B_fkey" FOREIGN KEY ("B") REFERENCES "Pot"("id") ON DELETE CASCADE ON UPDATE CASCADE;
