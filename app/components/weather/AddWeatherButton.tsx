'use client'

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react'
import redirect from 'next/navigation';
import FadeIn from '../animate/FadeIn';
import Popup from '@/app/utils/Popup';
import AlertLevel from '@/app/lib/definitions/AlertLevel';

const API_DOMAIN = process.env.NODE_ENV === "production" ? "https://weather.lilianbischung.fr" : "http://localhost:3000";
const USERNAME = "lirobi";

interface City {
    geonameId: number;
    name: string;
    countryName: string;
}

const AddWeatherButton = () => {
    const [isPopupOpen, setIsPopupOpen] = useState(false);
    const [citySuggestions, setCitySuggestions] = useState<City[]>([]);
    const [query, setQuery] = useState<string>("");
    const [isAdding, setIsAdding] = useState(false);


    function handleClick() {
        setIsPopupOpen(true);
    }

    function handleClosePopup() {
        setIsPopupOpen(false);
    }

    async function handleFormSubmit(event: FormEvent<HTMLFormElement>) {


        setIsAdding(true);
        event?.preventDefault();
        const formData = new FormData(event.currentTarget);

        const location = formData.get('location');

        const response = await fetch(API_DOMAIN + '/api/weather', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                location: location || '' // Ensure location is not null
            })
        });
        if (!response.ok) {
            const data = await response.json();
            Popup({
                alertLevel: AlertLevel.ERROR,
                message: data.error,
                duration: 3000
            })
            setIsAdding(false);
            setIsPopupOpen(false);
            throw new Error('Failed to add location');

        }

        setIsAdding(false);
        setIsPopupOpen(false);

        window.location.reload()

    }

    async function fetchCities(query: string) {
        try {
            const response = await fetch(`https://secure.geonames.org/searchJSON?q=${query}&maxRows=5&username=${USERNAME}`);
            const data = await response.json();
            setCitySuggestions(data.geonames);
        } catch (error) {
            console.error("Error fetching cities:", error);
        }
    }

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newQuery = e.target.value;
        setQuery(newQuery);

        if (newQuery.length > 0) {
            fetchCities(newQuery);
        } else {
            setCitySuggestions([]);
        }
    }


    return (
        <>
            <div className="addweatherbutton-container flex justify-center bg-gradient-to-br from-slate-100 via-slate-300 to-slate-300 flex flex-col rounded-2xl h-80 w-60 p-4 transition-all hover:scale-105" onClick={handleClick}>
                <div className="flex flex-row justify-center">
                    <button className="rounded-full bg-white w-16 h-16 text-4xl font-light text-purple-500 transition-all hover:bg-slate-100 transition-all hover:scale-110">+</button>
                </div>
            </div>

            {isPopupOpen && (
                <div className="fixed top-48">
                    <FadeIn>
                        <div className={` rounded-md bg-gradient-to-br from-slate-100 via-slate-300 to-slate-300 w-auto h-56  shadow-md`}>
                            <div className="flex flex-row flex-row items-center">
                                <span className="p-8"></span>
                                <p className='flex-grow text-center text-purple-500 p-5 text-2xl font-bold'>Add location</p>
                                <button className="text-purple-500 p-5 text-2xl transition-all hover:text-red-500 hover:font-bold" onClick={handleClosePopup}>&#x2715;</button>
                            </div>
                            <div>
                                <form onSubmit={handleFormSubmit} method="POST" className="flex flex-col w-full">
                                    <input list="locations"
                                        value={query}
                                        onChange={handleInputChange}
                                        type="text"
                                        name="location"
                                        className="self-center rounded-md p-2 w-4/5 transition-all hover:scale-105 pt-3 pb-3 shadow-md"
                                    />
                                    <datalist id="locations">
                                        {citySuggestions?.length > 0 && citySuggestions.map((city) => (
                                            <option key={city.geonameId} value={`${city.name}, ${city.countryName}`} />
                                        ))}
                                    </datalist>

                                    <input
                                        type="submit"
                                        value={isAdding ? "Adding..." : "Add"}
                                        className="
                                self-center 
                                rounded-md 
                                bg-purple-500 
                                p-2 
                                mt-5 
                                w-4/5 
                                text-white 
                                font-bold 
                                text-xl
                                border-purple-500
                                border-2
                                transition-all hover:scale-105
                                shadow-md<
                                "
                                    />

                                </form>
                            </div>

                        </div>
                    </FadeIn>
                </div>
            )}
        </>
    )
}

export default AddWeatherButton