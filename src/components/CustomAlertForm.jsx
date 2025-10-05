
import React, { useState } from "react";


const weatherOptions = ["Rainy", "Windy", "Hot", "Cold", "Clear"];

const CustomAlertForm = ({ city, onSetAlert }) => {
  const [targetWeather, setTargetWeather] = useState("");
  const [targetDate, setTargetDate] = useState("");
  const [alertCity, setAlertCity] = useState(city); 

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!targetWeather || !targetDate || !alertCity) {
      alert("Please enter city, select a weather condition, and a date.");
      return;
    }
    
    onSetAlert({
      city: alertCity, 
      targetWeather: targetWeather,
      targetDate: targetDate,
    });
    
    
    setTargetWeather("");
    setTargetDate("");
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="bg-white p-6 rounded-xl shadow-lg w-full max-w-md border-2 border-blue-500"
    >
      <h3 className="text-2xl font-bold mb-4 text-gray-800">What do you want to be alerted for?</h3>
      
      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          City for Alert:
        </label>
        <input
          type="text"
          value={alertCity}
          onChange={(e) => setAlertCity(e.target.value)}
          placeholder="City (defaults to current input)"
          className="w-full border-b-2 border-gray-300 p-2 text-lg focus:border-blue-500 outline-none"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block text-gray-700 font-bold mb-2">
          Target Weather Condition:
        </label>
        <select
          value={targetWeather}
          onChange={(e) => setTargetWeather(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-lg text-lg focus:border-blue-500 outline-none"
          required
        >
          <option value="" disabled>Select a condition</option>
          {weatherOptions.map((option) => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      <div className="mb-6">
        <label className="block text-gray-700 font-bold mb-2">
          Target Date:
        </label>
        <input
          type="date"
          value={targetDate}
          onChange={(e) => setTargetDate(e.target.value)}
          className="w-full border-2 border-gray-300 p-2 rounded-lg text-lg focus:border-blue-500 outline-none"
          required
        />
      </div>

      <button
        type="submit"
        className="bg-blue-500 text-white py-3 rounded-full w-full font-bold hover:bg-blue-600 transition"
      >
        Check for Alert Match
      </button>
    </form>
  );
};

export default CustomAlertForm;