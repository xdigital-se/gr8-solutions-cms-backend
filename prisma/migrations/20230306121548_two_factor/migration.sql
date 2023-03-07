-- AlterTable
ALTER TABLE "User" ADD COLUMN     "is_two_factor" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "two_factor_code" TEXT;
