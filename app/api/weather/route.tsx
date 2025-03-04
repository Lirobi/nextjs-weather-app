import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

// Helper function to add CORS headers
function addCORSHeaders(response: NextResponse) {
    response.headers.set('Access-Control-Allow-Origin', '*');
    response.headers.set('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    response.headers.set('Access-Control-Allow-Headers', 'Content-Type');
    return response;
}

export async function GET() {
    try {
        const locations = await prisma.weatherLocation.findMany()
        // Update weather data for each location using OpenMeteo API
        for (let location of locations) {
            try {
                // Get coordinates for the location using geocoding API
                const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(location.location)}&count=1`);
                const geocodeData = await geocodeResponse.json();

                if (geocodeData.results && geocodeData.results.length > 0) {
                    const { latitude, longitude } = geocodeData.results[0];

                    // Get weather data using coordinates
                    const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
                    const weatherData = await weatherResponse.json();

                    // Map weather code to weather type
                    let weatherType = "day";
                    switch (weatherData.current.weather_code) {
                        case 1:
                            weatherType = "cloudy-day-1";
                            break;
                        case 2:
                            weatherType = "cloudy-day-2";
                            break;
                        case 3:
                            weatherType = "cloudy-day-3";
                            break;

                        case 45:
                        case 48:
                            weatherType = "fog";
                            break;

                        case 51:
                        case 53:
                        case 55:
                            weatherType = "rainy-7";
                            break;

                        case 56:
                        case 57:
                            weatherType = "snow-and-sleet-mix";
                            break;

                        case 61:
                            weatherType = "rainy-4";
                            break;
                        case 63:
                            weatherType = "rainy-5";
                            break;
                        case 65:
                            weatherType = "rainy-6";
                            break;

                        case 66:
                        case 67:
                            weatherType = "snow-and-sleet-mix";
                            break;

                        case 71:
                            weatherType = "snowy-2";
                            break;
                        case 73:
                        case 75:
                            weatherType = "snowy-3";
                            break;

                        case 77:
                            weatherType = "snowy";
                            break;

                        case 80:
                        case 81:
                        case 82:
                            weatherType = "rainy-7";
                            break;

                        case 85:
                            weatherType = "snowy-5";
                            break;
                        case 86:
                            weatherType = "snowy-6";
                            break;

                        case 95:
                        case 96:
                        case 99:
                            weatherType = "thunder";
                            break;

                        default:
                            weatherType = "day";
                    }

                }
            } catch (error) {
                console.error(`Failed to update weather for ${location.location}:`, error);
            }
        }
        return addCORSHeaders(NextResponse.json(locations))
    } catch (error) {
        return addCORSHeaders(NextResponse.json({ error: 'Failed to fetch locations' }, { status: 500 }))
    }
}

export async function POST(request: Request) {
    if (process.env.NODE_ENV === 'production') {
        return addCORSHeaders(NextResponse.json({ error: 'You are not allowed to do that' }, { status: 403 }))
    }

    try {
        if (!request.body) {
            return addCORSHeaders(NextResponse.json({ error: 'Request body is required' }, { status: 400 }))
        }

        const body = await request.json()
        if (!body || !body.location) {
            return addCORSHeaders(NextResponse.json({ error: 'Location is required' }, { status: 400 }))
        }

        // Get coordinates for the location using geocoding API

        const geocodeResponse = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(body.location)}&count=1`);
        const geocodeData = await geocodeResponse.json();
        if (!geocodeData.results || geocodeData.results.length === 0) {
            return addCORSHeaders(NextResponse.json({ error: 'Location not found' }, { status: 400 }));
        }


        const { latitude, longitude } = geocodeData.results[0];

        console.log("Got coordinates")
        // Get initial weather data
        const weatherResponse = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,weather_code`);
        const weatherData = await weatherResponse.json();

        console.log("got weather");

        console.log(weatherData);
        // Map weather code to weather type
        let weatherType = "day";
        switch (weatherData.current.weather_code) {
            case 1:
                weatherType = "cloudy-day-1";
                break;
            case 2:
                weatherType = "cloudy-day-2";
                break;
            case 3:
                weatherType = "cloudy-day-3";
                break;

            case 45:
            case 48:
                weatherType = "fog";
                break;

            case 51:
            case 53:
            case 55:
                weatherType = "rainy-7";
                break;

            case 56:
            case 57:
                weatherType = "snow-and-sleet-mix";
                break;

            case 61:
                weatherType = "rainy-4";
                break;
            case 63:
                weatherType = "rainy-5";
                break;
            case 65:
                weatherType = "rainy-6";
                break;

            case 66:
            case 67:
                weatherType = "snow-and-sleet-mix";
                break;

            case 71:
                weatherType = "snowy-2";
                break;
            case 73:
            case 75:
                weatherType = "snowy-3";
                break;

            case 77:
                weatherType = "snowy";
                break;

            case 80:
            case 81:
            case 82:
                weatherType = "rainy-7";
                break;

            case 85:
                weatherType = "snowy-5";
                break;
            case 86:
                weatherType = "snowy-6";
                break;

            case 95:
            case 96:
            case 99:
                weatherType = "thunder";
                break;

            default:
                weatherType = "day";
        }

        console.log("got weather code")
        console.log("temperature: " + Math.round(weatherData.current.temperature_2m as number))
        console.log("weathertype: " + weatherType)
        console.log("location: " + body.location)

        let location;
        try {
            try {
                location = await prisma.weatherLocation.create({
                    data: {
                        location: body.location,
                        temperature: Math.round(weatherData.current.temperature_2m as number),
                        measurementSystem: "°C",
                        description: weatherType,
                        weatherType: weatherType,
                    },
                });
            } catch (error: any) {
                console.error("Échec de la création dans Prisma :", {
                    message: error.message,
                    code: error.code,
                    meta: error.meta,
                });
                return addCORSHeaders(NextResponse.json(
                    { error: 'Database insertion failed' },
                    { status: 500 }
                ));
            }
            console.log(location)
            console.log("added to database")
        } catch (error) {
            console.error("Failed to create weather location:", error);
            throw error;
        }
        return addCORSHeaders(NextResponse.json(location))
    } catch (error) {
        return addCORSHeaders(NextResponse.json({ error: 'Failed to create location' }, { status: 500 }))
    }
}

export async function DELETE(request: Request) {
    if (process.env.NODE_ENV === 'production') {
        return addCORSHeaders(NextResponse.json({ error: 'You are not allowed to do that' }, { status: 403 }))
    }

    try {
        const body = await request.json()
        const location = await prisma.weatherLocation.delete(
            {
                where: {
                    id: body.id
                }
            }
        )
        return addCORSHeaders(NextResponse.json(location))

    } catch (error) {
        return addCORSHeaders(NextResponse.json({ error: 'Failed to delete' }, { status: 500 }))
    }
}
