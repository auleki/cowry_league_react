-- AlterTable
ALTER TABLE "Player" ADD COLUMN     "emailVerified" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "emailVerifiedToken" TEXT,
ADD COLUMN     "emailVerifiedTokenExpiresAt" TIMESTAMP(3);
