/*
  Warnings:

  - Added the required column `estimated_hours` to the `Job` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "estimated_hours" INTEGER NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "daily_hour_limit" INTEGER NOT NULL DEFAULT 4,
ADD COLUMN     "is_student" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "weekly_hour_limit" INTEGER NOT NULL DEFAULT 20;
