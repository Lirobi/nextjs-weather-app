'use client'
import React from 'react'

interface WeatherCardProps {
    id: number,
    location: string,
    temperature: number | undefined, 
    measurementSystem: string | undefined,
    description: string | undefined,
    weatherType: string
}
const WeatherCard = (props: WeatherCardProps) => {

    async function handleDelete() {
        const response = await fetch("http://localhost:3000/api/weather",  {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({
                id: props.id,
              })
        })
    }

    const weatherIconURL = `http://localhost:3000/media/images/static/${props.weatherType}.svg`
    let backgroundColor = `bg-slate-200`
    if(props.temperature && props.temperature >= 25 && props.weatherType == "day" ) {
        backgroundColor = `bg-gradient-to-br from-amber-200 via-amber-400 to-amber-600`
    } 
    else if (props.weatherType.includes("rain")) {
        backgroundColor = `bg-gradient-to-br from-blue-200 via-blue-400 to-blue-600`
    } 
    else if (props.weatherType.includes("cloud")) {
        backgroundColor = `bg-gradient-to-br from-neutral-200 via-neutral-400 to-neutral-600`
    }
    else if (props.weatherType.includes("fog")) {
        backgroundColor = `bg-gradient-to-br from-gray-200 via-gray-400 to-gray-600`
    }
    else if (props.weatherType.includes("snow")) {
        backgroundColor = `bg-gradient-to-br from-slate-200 via-slate-400 to-slate-600`
    }
    else if (props.weatherType.includes("day")) {
        backgroundColor = `bg-gradient-to-br from-sky-200 via-sky-400 to-sky-600`
    }
    else if (props.weatherType.includes("thunder")) {
        backgroundColor = `bg-gradient-to-br from-purple-200 via-purple-400 to-purple-600`
    }
    
    
    
    

  return (
    <>
        <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/4.7.0/css/font-awesome.min.css"></link>
        <div className={`${backgroundColor} group flex flex-col rounded-2xl h-80 w-60 p-4 shadow-md transition-all hover:scale-105 `}>

            <div className="flex flex-row justify-center mt-2 max-h-7">
                <h3 className="text-white font-bold text-xl">{props.location}</h3>
            </div>

            <div className="flex flex-row justify-center scale-150 mt-6">
                <div className="scale-105">
                    <object data={weatherIconURL} type="image/svg+xml" width="64" height="64"></object>
                </div>
            </div>

            <div className="flex flex-row justify-center mt-6">
                <h1 className="font-bold text-white text-5xl">{props.temperature}{props.measurementSystem}</h1>
            </div>


            <div className="flex flex-row justify-center mt-6">
                <button className="transition-all invisible group-hover:visible flex flex-row justify-center rounded-full bg-red-500 w-16 h-16 text-4xl font-light text-red-900   hover:scale-110" onClick={handleDelete}>
                    <i className="fa fa-trash-o self-center"></i>
                </button>
            </div>

            

        </div>
    </>
  )
}

export default WeatherCard