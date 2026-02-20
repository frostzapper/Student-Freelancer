-- AlterTable
ALTER TABLE "Job" ADD COLUMN     "auction_end" TIMESTAMP(3),
ADD COLUMN     "auction_mode" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "AuctionBid" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "pitch" TEXT NOT NULL,
    "confidence" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuctionBid_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBid" ADD CONSTRAINT "AuctionBid_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
