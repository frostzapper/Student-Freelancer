-- CreateTable
CREATE TABLE "WorkerEntity" (
    "id" SERIAL NOT NULL,
    "job_id" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "leader_id" INTEGER NOT NULL,
    "status" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WorkerEntity_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WorkerEntity_job_id_key" ON "WorkerEntity"("job_id");

-- AddForeignKey
ALTER TABLE "WorkerEntity" ADD CONSTRAINT "WorkerEntity_leader_id_fkey" FOREIGN KEY ("leader_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerEntity" ADD CONSTRAINT "WorkerEntity_job_id_fkey" FOREIGN KEY ("job_id") REFERENCES "Job"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
