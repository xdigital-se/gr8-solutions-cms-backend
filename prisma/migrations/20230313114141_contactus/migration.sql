/*
  Warnings:

  - Added the required column `message` to the `ContactUs` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ContactUs" ADD COLUMN     "message" TEXT NOT NULL;
