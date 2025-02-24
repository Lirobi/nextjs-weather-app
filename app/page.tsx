import React from 'react'
import WeatherCard from './components/weather/WeatherCard'
import AddWeatherButton from './components/weather/AddWeatherButton'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export default async function Page() {
  const locations = await prisma.weatherLocation.findMany()

  return (
    <>
      <div className="h-10"></div>
      <div className="weathercards-container flex flex-row justify-center gap-6 flex-wrap">
        {locations.map((location) => (
          <WeatherCard
            key={location.id}
            id={location.id}
            location={location.location}
            temperature={location.temperature}
            measurementSystem="°C"
            description={location.description}
            weatherType={location.weatherType}
          />
        ))}
        <AddWeatherButton />
      </div>
    </>
  )
}
