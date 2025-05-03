-- AlterTable
ALTER TABLE "Pot" ADD COLUMN     "highestCowryReward" DOUBLE PRECISION NOT NULL DEFAULT 1000,
ADD COLUMN     "initialCowryReward" DOUBLE PRECISION NOT NULL DEFAULT 100,
ALTER COLUMN "potPrice" SET DEFAULT 0,
ALTER COLUMN "potPrice" SET DATA TYPE DOUBLE PRECISION;

-- CreateTable
CREATE TABLE "Game" (
    "id" SERIAL NOT NULL,
    "playerId" INTEGER,
    "potId" INTEGER NOT NULL,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "isOpen" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Game_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_PlayersInGame" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_PlayersInGame_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_PlayersInGame_B_index" ON "_PlayersInGame"("B");

-- AddForeignKey
ALTER TABLE "Game" ADD CONSTRAINT "Game_potId_fkey" FOREIGN KEY ("potId") REFERENCES "Pot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayersInGame" ADD CONSTRAINT "_PlayersInGame_A_fkey" FOREIGN KEY ("A") REFERENCES "Game"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_PlayersInGame" ADD CONSTRAINT "_PlayersInGame_B_fkey" FOREIGN KEY ("B") REFERENCES "Player"("id") ON DELETE CASCADE ON UPDATE CASCADE;
