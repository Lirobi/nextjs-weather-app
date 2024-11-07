/*
  Warnings:

  - Added the required column `description` to the `WeatherLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `measurementSystem` to the `WeatherLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `temperature` to the `WeatherLocation` table without a default value. This is not possible if the table is not empty.
  - Added the required column `weatherType` to the `WeatherLocation` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WeatherLocation" ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "measurementSystem" TEXT NOT NULL,
ADD COLUMN     "temperature" INTEGER NOT NULL,
ADD COLUMN     "weatherType" TEXT NOT NULL;
