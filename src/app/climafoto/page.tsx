"use client"
import React, { useState } from 'react';
import { useMediaQuery } from 'react-responsive';

const WeatherForecast = () => {
    const [location, setLocation] = useState('');
    const [forecast, setForecast] = useState([]);
    const [images, setImages] = useState([]);
    const [error, setError] = useState('');

    const isMobile = useMediaQuery({ maxWidth: 768 }); // Define como móvil si el ancho de la pantalla es menor o igual a 768px

    const handleLocationChange = (event) => {
        setLocation(event.target.value);
    };

    const search = () => {
        if (!location.trim()) {
            setError('Por favor, introduce una ubicación válida.');
            return;
        }

        // Lógica para obtener datos del clima
        fetchWeatherData();

        // Lógica para obtener imágenes
        fetchImageData();
    };

    const fetchWeatherData = async () => {
        try {
            const apiKey = '8a582c538e304df4a12122022241804';
            const weatherApiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${apiKey}&q=${location}&days=1`;

            const response = await fetch(weatherApiUrl);
            const data = await response.json();
            setForecast(data.forecast.forecastday);
            setError('');
        } catch (error) {
            console.error('Error fetching weather data:', error);
            setError('Error al obtener datos del clima. Por favor, inténtalo de nuevo.');
        }
    };

    const fetchImageData = () => {
        const clientId = 'U7UH-i5Et_JtU3nBRWqrGwYzwm3fMOObetZGr7stm1Y';
        const endpoint = 'https://api.unsplash.com/search/photos';

        const query = `${location} ciudad`; // Incluir la palabra "ciudad" en la búsqueda de imágenes

        fetch(`${endpoint}?query=${query}&client_id=${clientId}`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Error en la solicitud de búsqueda de imágenes.');
                }
                return response.json();
            })
            .then(jsonResponse => {
                setImages(jsonResponse.results);
                setError('');
            })
            .catch(error => {
                console.error('Error en la solicitud de búsqueda de imágenes:', error.message);
                setError('Error en la solicitud de búsqueda de imágenes. Por favor, inténtalo de nuevo.');
            });
    };

    const getWeatherImageType = (maxTemp) => {
        // Determina el tipo de imagen basado en la temperatura máxima
        if (maxTemp > 24) {
            return "soleado";
        } else {
            return "invierno"; // Cambia esto por el tipo de imagen que desees mostrar para temperaturas menores o iguales a 24
        }
    };

    const getColumnCount = () => {
        return isMobile ? 2 : 4;
    };

    return (
        <div className="h-full w-full mx-auto bg-gray-100 text-black text-center">
            <h1 className="text-2xl font-bold mb-4">Api Clima con fotos</h1>
            <div className="mb-4 flex flex-col items-center">
                <input
                    type="text"
                    className='text-black border border-gray-300 px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-blue-500 mb-2'
                    placeholder="Enter location (e.g., Diamante)"
                    value={location}
                    onChange={handleLocationChange}
                />
                <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={search}>Buscar</button>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}

            <ul className="text-left">
                {forecast.map((day) => (
                    <li key={day.date}>
                        <p>Fecha: {day.date}</p>
                        <p>Temperatura Máxima: {day.day.maxtemp_c}°C</p>
                        <p>Temperatura Mínima: {day.day.mintemp_c}°C</p>
                    </li>
                ))}
            </ul>

            <div className={`grid grid-cols-${getColumnCount()} gap-4 mt-4 px-2`}>
                {images.map((image) => (
                    // Aquí se utiliza la función getWeatherImageType para determinar el tipo de imagen
                    // Cambia la lógica aquí según tus necesidades para mostrar diferentes tipos de imágenes
                    <img key={image.id} src={getWeatherImageType(forecast[0]?.day.maxtemp_c) === "soleado" ? image.urls.thumb : image.urls.default} alt="" className="w-full" />
                ))}
            </div>
        </div>
    );
};

export default WeatherForecast;
