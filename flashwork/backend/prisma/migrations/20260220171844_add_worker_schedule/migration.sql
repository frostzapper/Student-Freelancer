-- CreateTable
CREATE TABLE "WorkerSchedule" (
    "id" SERIAL NOT NULL,
    "worker_id" INTEGER NOT NULL,
    "day_of_week" INTEGER NOT NULL,
    "start_time" TEXT NOT NULL,
    "end_time" TEXT NOT NULL,

    CONSTRAINT "WorkerSchedule_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerSchedule" ADD CONSTRAINT "WorkerSchedule_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
