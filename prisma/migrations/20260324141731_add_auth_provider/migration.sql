-- CreateEnum
CREATE TYPE "AuthProvider" AS ENUM ('credentials', 'google', 'discord');

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "authProvider" "AuthProvider" NOT NULL DEFAULT 'credentials';
