
import React, { useState } from "react";
import WeatherForm from "./components/WeatherForm";
import WeatherCard from "./components/WeatherCard";
import Loader from "./components/Loader";
import CustomAlertForm from "./components/CustomAlertForm"; 

export default function App() {
  const [city, setCity] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  

  const [view, setView] = useState('home');
  const [alertResult, setAlertResult] = useState(null);

 
  const getWeatherType = (temp, precipitation, wind) => {
    
    if (precipitation > 0) return "rainy";
    if (temp > 28) return "hot";
    if (wind > 20) return "windy";
    if (temp < 15) return "cold";
    return "clear";
  };

  const fetchWeather = async (options = {}) => {
    const { targetCity, targetDate, isAlertCheck } = options;

    const cityToFetch = targetCity || city;
    const dateToFetch = targetDate || date;
    const timeToFetch = isAlertCheck ? '12:00' : time;

    if (!cityToFetch || !dateToFetch) {
      if (!isAlertCheck) {
        setError("Please enter city, date, and time.");
        setWeather(null);
      }
      return null;
    }

    if (!isAlertCheck) {
        setLoading(true);
        setWeather(null);
        setError("");
    }


    try {
      const geoRes = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${cityToFetch}&count=1`
      );
      const geoData = await geoRes.json();

      if (!geoData.results || geoData.results.length === 0) {
        if (!isAlertCheck) setError("City not found.");
        setLoading(false);
        return null;
      }

      const { latitude, longitude, name } = geoData.results[0];

      
      const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m,precipitation,windspeed_10m&timezone=auto`;
      const res = await fetch(weatherUrl);
      const data = await res.json();

      const userDateTime = new Date(`${dateToFetch}T${timeToFetch}`);
      const times = data.hourly.time;

      let closestIndex = 0;
      let minDiff = Infinity;

      for (let i = 0; i < times.length; i++) {
        const diff = Math.abs(new Date(times[i]) - userDateTime);
        if (diff < minDiff) {
          minDiff = diff;
          closestIndex = i;
        }
      }
      
      const result = {
        temp: data.hourly.temperature_2m[closestIndex],
        precipitation: data.hourly.precipitation[closestIndex],
        wind: data.hourly.windspeed_10m[closestIndex],
        cityName: name,
        
        hourlyTimes: data.hourly.time,
        hourlyTemps: data.hourly.temperature_2m,
        hourlyPrecipitation: data.hourly.precipitation,
        hourlyWind: data.hourly.windspeed_10m,
      };

      if (!isAlertCheck) {
          setWeather(result);
      }
      
      return result;

    } catch (err) {
      console.error(err);
      if (!isAlertCheck) setError("Error fetching weather.");
      return null;
    } finally {
      if (!isAlertCheck) setLoading(false);
    }
  };

  const handleSetAlert = async (criteria) => {
    setAlertResult(null);
    setView('home'); 
    setLoading(true);

    const data = await fetchWeather({ 
        targetCity: criteria.city, 
        targetDate: criteria.targetDate, 
        isAlertCheck: true 
    });

    setLoading(false);

    if (data) {
      let matchingTimes = [];
      const targetType = criteria.targetWeather.toLowerCase();
      const targetDateISO = criteria.targetDate;

     
      for (let i = 0; i < data.hourlyTimes.length; i++) {
        const currentHour = new Date(data.hourlyTimes[i]);
        
        if (currentHour.toISOString().startsWith(targetDateISO)) {
          const temp = data.hourlyTemps[i];
          const precipitation = data.hourlyPrecipitation[i];
          const wind = data.hourlyWind[i];

          const actualWeatherType = getWeatherType(temp, precipitation, wind);
          
          if (actualWeatherType === targetType) {
            matchingTimes.push(currentHour.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' }));
          }
        }
      }

      setAlertResult({
        match: matchingTimes.length > 0,
        times: matchingTimes,
        condition: criteria.targetWeather,
        date: criteria.targetDate,
        city: criteria.city,
      });
    }
  };

  const renderAlertResult = () => {
    if (!alertResult) return null;
    
    const { match, times, condition, date, city } = alertResult;
    
    if (match) {
      return (
        <div className="mt-8 p-6 bg-green-100 border-2 border-green-500 rounded-lg text-center shadow-lg w-full max-w-md">
          <h3 className="text-xl font-bold text-green-700 mb-2">✅ ALERT MATCHED!</h3>
          <p className="font-semibold mb-2">
            **{condition}** is predicted in **{city}** on **{date}**.
          </p>
          <p className="font-bold">Matching Times:</p>
          <p className="text-lg text-green-800">{times.join(' | ')}</p>
          <button className="mt-3 text-sm text-gray-500" onClick={() => setAlertResult(null)}>Clear Alert</button>
        </div>
      );
    } else {
      return (
        <div className="mt-8 p-6 bg-red-100 border-2 border-red-500 rounded-lg text-center shadow-lg w-full max-w-md">
          <h3 className="text-xl font-bold text-red-700 mb-2">❌ No Match Found</h3>
          <p className="font-semibold">
            **{condition}** is NOT predicted for **{city}** on **{date}**.
          </p>
          <button className="mt-3 text-sm text-gray-500" onClick={() => setAlertResult(null)}>Clear Alert</button>
        </div>
      );
    }
  };
  
  // Custom Alert Setup Page View
  if (view === 'alert_setup') {
    return (
      <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8 font-sans">
        <h1 className="text-5xl font-extrabold text-gray-900 mb-8 tracking-tight">
          Custom Alert Setup 🔔
        </h1>
        <button 
          onClick={() => setView('home')} 
          className="text-blue-600 hover:text-blue-800 font-bold mb-4"
        >
          &larr; Back to Predictor
        </button>
        <CustomAlertForm city={city} onSetAlert={handleSetAlert} />
      </div>
    );
  }

  // Home View
  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-start p-8 font-sans">
      <h1 className="text-5xl font-extrabold text-gray-900 mb-12 tracking-tight">
        Weather Predictor
      </h1>

      <WeatherForm
        date={date}
        time={time}
        city={city}
        setDate={setDate}
        setTime={setTime}
        setCity={setCity}
        onSubmit={() => fetchWeather({isAlertCheck: false})} 
      />

      {/* NEW BUTTON: Switch to Custom Alert view */}
      <button
        onClick={() => setView('alert_setup')}
        className="mt-6 bg-blue-500 text-white py-2 px-6 rounded-full font-bold hover:bg-blue-600 transition shadow-md"
      >
        Set Custom Alert 🎯
      </button>

      {loading && <Loader />}
      {error && <p className="text-red-600 mt-6 font-medium">{error}</p>}
      
      {/* NEW: Display Alert Result */}
      {alertResult && renderAlertResult()}
      
      {weather && (
        <WeatherCard
          weather={weather}
          city={weather.cityName}
          date={date}
          time={time}
        />
      )}
    </div>
  );
}