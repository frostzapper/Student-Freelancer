-- CreateTable
CREATE TABLE "WorkerGroupMember" (
    "id" SERIAL NOT NULL,
    "worker_entity_id" INTEGER NOT NULL,
    "worker_id" INTEGER NOT NULL,

    CONSTRAINT "WorkerGroupMember_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WorkerGroupMember" ADD CONSTRAINT "WorkerGroupMember_worker_entity_id_fkey" FOREIGN KEY ("worker_entity_id") REFERENCES "WorkerEntity"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "WorkerGroupMember" ADD CONSTRAINT "WorkerGroupMember_worker_id_fkey" FOREIGN KEY ("worker_id") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
