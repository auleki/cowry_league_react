-- CreateTable
CREATE TABLE "Player" (
    "id" SERIAL NOT NULL,
    "firstname" TEXT NOT NULL,
    "lastname" TEXT NOT NULL,
    "dateJoined" TIMESTAMP(3) NOT NULL,
    "potsJoined" JSONB,
    "currentPot" JSONB,
    "nairaBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,
    "cowryBalance" DOUBLE PRECISION NOT NULL DEFAULT 0,

    CONSTRAINT "Player_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Pot" (
    "id" SERIAL NOT NULL,
    "potFee" DOUBLE PRECISION NOT NULL,
    "potSize" JSONB,
    "potOpen" TIMESTAMP(3) NOT NULL,
    "potClose" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pot_pkey" PRIMARY KEY ("id")
);
