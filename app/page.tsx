
import React from 'react'
import WeatherCard from './components/weather/WeatherCard'
import AddWeatherButton from './components/weather/AddWeatherButton'



export default async function Page() {

  const response = await fetch('http://localhost:3000/api/weather', {
    method: 'GET'
  })

  const data = await response.json();
  
  
  



  return (
    <>

      
      <div className="h-10"></div>

      <div className="weathercards-container flex flex-row justify-center gap-6 flex-wrap">

      {data.map((location: any) => (
        <WeatherCard
          key={location.id}
          id={location.id}
          location={location.location}
          temperature={location.temperature}
          measurementSystem= "°C"
          description= {location.description}
          weatherType= {location.weatherType}
          />
        ))}
      
        <AddWeatherButton/>
      </div>
        
    </>
  )
}
