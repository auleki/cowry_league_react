-- CreateTable
CREATE TABLE "Cowry" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL DEFAULT 'Cowry',
    "totalSupply" BIGINT NOT NULL,
    "withdrawalRate" DOUBLE PRECISION NOT NULL DEFAULT 0.88,
    "rateToNaira" DOUBLE PRECISION NOT NULL DEFAULT 10,
    "transactionId" BIGINT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Cowry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CowryTransactions" (
    "id" BIGSERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "amount" INTEGER NOT NULL,
    "transactionType" TEXT NOT NULL,
    "referenceId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "CowryTransactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FiatTransactions" (
    "id" BIGSERIAL NOT NULL,
    "playerId" INTEGER NOT NULL,
    "fiatAmount" INTEGER NOT NULL,
    "cowryAmount" INTEGER NOT NULL,

    CONSTRAINT "FiatTransactions_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Cowry" ADD CONSTRAINT "Cowry_transactionId_fkey" FOREIGN KEY ("transactionId") REFERENCES "CowryTransactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CowryTransactions" ADD CONSTRAINT "CowryTransactions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FiatTransactions" ADD CONSTRAINT "FiatTransactions_playerId_fkey" FOREIGN KEY ("playerId") REFERENCES "Player"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
