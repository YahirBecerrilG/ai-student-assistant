-- CreateTable
CREATE TABLE "PendingAction" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER NOT NULL,
    "action" TEXT NOT NULL,
    "taskId" INTEGER,
    "taskReference" TEXT,
    "updates" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PendingAction_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PendingAction_userId_key" ON "PendingAction"("userId");

-- AddForeignKey
ALTER TABLE "PendingAction" ADD CONSTRAINT "PendingAction_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
