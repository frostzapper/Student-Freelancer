/*
  Warnings:

  - You are about to drop the column `confidence` on the `AuctionBid` table. All the data in the column will be lost.
  - You are about to drop the column `pitch` on the `AuctionBid` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[job_id,worker_id]` on the table `AuctionBid` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `bid_amount` to the `AuctionBid` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "AuctionBid" DROP COLUMN "confidence",
DROP COLUMN "pitch",
ADD COLUMN     "bid_amount" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "message" TEXT,
ADD COLUMN     "status" TEXT NOT NULL DEFAULT 'pending';

-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "work_location" TEXT NOT NULL DEFAULT 'online';

-- CreateIndex
CREATE UNIQUE INDEX "AuctionBid_job_id_worker_id_key" ON "AuctionBid"("job_id", "worker_id");
