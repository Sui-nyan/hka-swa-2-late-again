-- CreateTable
CREATE TABLE "Station" (
    "eva" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "ds100" TEXT NOT NULL,
    "meta" TEXT[],
    "p" TEXT[],
    "isDb" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "Station_pkey" PRIMARY KEY ("eva")
);

-- CreateTable
CREATE TABLE "Plan" (
    "id" SERIAL NOT NULL,
    "eva" INTEGER NOT NULL,
    "targetDatetime" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Stop" (
    "id" TEXT NOT NULL,
    "trainInfoId" INTEGER NOT NULL,
    "planId" INTEGER NOT NULL,

    CONSTRAINT "Stop_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Arrival" (
    "pt" TIMESTAMP(3) NOT NULL,
    "ppth" TEXT[],
    "stopId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Departure" (
    "pt" TIMESTAMP(3) NOT NULL,
    "ppth" TEXT[],
    "stopId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "TrainInfo" (
    "id" SERIAL NOT NULL,
    "c" TEXT,
    "n" TEXT,
    "f" TEXT,
    "o" TEXT,
    "t" TEXT,

    CONSTRAINT "TrainInfo_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Station_ds100_key" ON "Station"("ds100");

-- CreateIndex
CREATE UNIQUE INDEX "Plan_eva_targetDatetime_key" ON "Plan"("eva", "targetDatetime");

-- CreateIndex
CREATE UNIQUE INDEX "Arrival_stopId_key" ON "Arrival"("stopId");

-- CreateIndex
CREATE UNIQUE INDEX "Departure_stopId_key" ON "Departure"("stopId");

-- AddForeignKey
ALTER TABLE "Plan" ADD CONSTRAINT "Plan_eva_fkey" FOREIGN KEY ("eva") REFERENCES "Station"("eva") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_trainInfoId_fkey" FOREIGN KEY ("trainInfoId") REFERENCES "TrainInfo"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Stop" ADD CONSTRAINT "Stop_planId_fkey" FOREIGN KEY ("planId") REFERENCES "Plan"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Arrival" ADD CONSTRAINT "Arrival_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Departure" ADD CONSTRAINT "Departure_stopId_fkey" FOREIGN KEY ("stopId") REFERENCES "Stop"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
