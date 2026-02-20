-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "auto_group" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "required_group_size" INTEGER;
