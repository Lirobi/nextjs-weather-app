-- CreateTable
CREATE TABLE "WeatherLocation" (
    "id" SERIAL NOT NULL,
    "location" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WeatherLocation_pkey" PRIMARY KEY ("id")
);
