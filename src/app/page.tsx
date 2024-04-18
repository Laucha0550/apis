"use client"
import React, { useState } from 'react';

const clientId = 'U7UH-i5Et_JtU3nBRWqrGwYzwm3fMOObetZGr7stm1Y';
const weatherApiKey = '8a582c538e304df4a12122022241804';

const WeatherForecast = () => {
  const [location, setLocation] = useState('');
  const [forecast, setForecast] = useState([]);
  const [currentCondition, setCurrentCondition] = useState('');
  const [weatherImages, setWeatherImages] = useState([]);
  const [cityImages, setCityImages] = useState([]);

  const handleLocationChange = (event) => {
    setLocation(event.target.value);
  };

  const getWeatherData = async () => {
    try {
      const apiUrl = `https://api.weatherapi.com/v1/forecast.json?key=${weatherApiKey}&q=${location}&days=1`;

      const response = await fetch(apiUrl);
      const data = await response.json();
      setForecast(data.forecast.forecastday);
      setCurrentCondition(data.current.condition.text);

      // Después de obtener el pronóstico del tiempo, busca imágenes relevantes
      searchImages(data.current.condition.text, setWeatherImages);
    } catch (error) {
      console.error('Error fetching weather data:', error);
    }
  };

  const searchImages = async (query, setImageState) => {
    try {
      const searchQuery = query + ' ciudad';
      const response = await fetch(`https://api.unsplash.com/search/photos?query=${searchQuery}&client_id=${clientId}&per_page=5`);
      const data = await response.json();
      setImageState(data.results);
    } catch (error) {
      console.error('Error fetching images:', error);
    }
  };

  const handleSearch = () => {
    getWeatherData();
    searchImages(location, setCityImages);
  };

  return (
    <div className="h-screen overflow-auto w-full mx-auto bg-gray-100 text-black text-center">
      <h1 className="text-2xl font-bold mb-4">API Clima con fotos</h1>
      <div className="mb-4 flex flex-col items-center">
        <input
          type="text"
          className='text-black border border-gray-300 px-4 py-2 rounded-lg w-64 focus:outline-none focus:border-blue-500 mb-2'
          placeholder="Ingrese una ciudad (ej, Diamante)"
          value={location}
          onChange={handleLocationChange}
        />
        <button className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600" onClick={handleSearch}>Buscar</button>
      </div>
      <ul className="">
        {forecast.map((day) => (
          <li key={day.date}>
            <p>Fecha: {day.date}</p>
            <p>Temperatura Máxima: {day.day.maxtemp_c}°C</p>
            <p>Temperatura Mínima: {day.day.mintemp_c}°C</p>
            <p>Condición Actual: {currentCondition}</p>
          </li>
        ))}
      </ul>

      <div className={`grid xl:grid-cols-4 grid-cols-2 gap-4 mt-4 px-2`}>
        {weatherImages.map((image) => (
          <img key={image.id} src={image.urls.small} alt="" className="w-[350px]" />
        ))}
      </div>

      <div className={`grid xl:grid-cols-4 grid-cols-2 gap-4 mt-4 px-2`}>
        {cityImages.map((image) => (
          <img key={image.id} src={image.urls.small} alt="" className="w-[350px]" />
        ))}
      </div>
    </div>
  );
};

export default WeatherForecast;