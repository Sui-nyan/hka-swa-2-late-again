-- CreateTable
CREATE TABLE "StopChange" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "referenceId" TEXT NOT NULL,

    CONSTRAINT "StopChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArrivalChange" (
    "id" SERIAL NOT NULL,
    "ct" TIMESTAMP(3),
    "clt" TIMESTAMP(3),
    "cs" TEXT,
    "stopChangeId" INTEGER NOT NULL,

    CONSTRAINT "ArrivalChange_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "DepartureChange" (
    "id" SERIAL NOT NULL,
    "ct" TIMESTAMP(3),
    "clt" TIMESTAMP(3),
    "cs" TEXT,
    "stopChangeId" INTEGER NOT NULL,

    CONSTRAINT "DepartureChange_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArrivalChange_stopChangeId_key" ON "ArrivalChange"("stopChangeId");

-- CreateIndex
CREATE UNIQUE INDEX "DepartureChange_stopChangeId_key" ON "DepartureChange"("stopChangeId");

-- AddForeignKey
ALTER TABLE "StopChange" ADD CONSTRAINT "StopChange_referenceId_fkey" FOREIGN KEY ("referenceId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArrivalChange" ADD CONSTRAINT "ArrivalChange_stopChangeId_fkey" FOREIGN KEY ("stopChangeId") REFERENCES "StopChange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DepartureChange" ADD CONSTRAINT "DepartureChange_stopChangeId_fkey" FOREIGN KEY ("stopChangeId") REFERENCES "StopChange"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
