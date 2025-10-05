import React from "react";

const WeatherCard = ({ weather, city, date, time }) => {
  if (!weather) return null;

  const getWeatherText = () => {
    if (weather.precipitation > 0) return "Rainy 🌧️";
    if (weather.temp > 28) return "Hot ☀️";
    if (weather.wind > 20) return "Windy 💨";
    if (weather.temp < 15) return "Cold ❄️";
    return "Mild 🌤️";
  };

  return (
    <div className="mt-12 bg-white shadow-2xl rounded-3xl p-8 w-full max-w-md text-center">
      <h2 className="text-3xl font-extrabold mb-2">{city}</h2>
      <p className="text-gray-600 mb-2">
        {date} ⏰ {time}
      </p>
      <p className="text-2xl font-bold mb-4">{getWeatherText()}</p>
      <div className="flex justify-around text-gray-700 font-semibold text-lg">
        <p>🌡️ {weather.temp}°C</p>
        <p>💨 {weather.wind} km/h</p>
        <p>🌧️ {weather.precipitation} mm</p>
      </div>
    </div>
  );
};

export default WeatherCard;