    import React from "react";

const WeatherForm = ({ date, time, city, setDate, setTime, setCity, onSubmit }) => {
  return (
    <div className="bg-white shadow-lg rounded-3xl p-8 w-full max-w-lg flex flex-col gap-4">
      <input
        type="text"
        placeholder="Enter City"
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="border-b-2 border-gray-300 focus:border-black outline-none text-lg py-2"
      />
      <input
        type="date"
        value={date}
        onChange={(e) => setDate(e.target.value)}
        className="border-b-2 border-gray-300 focus:border-black outline-none text-lg py-2"
      />
      <input
        type="time"
        value={time}
        onChange={(e) => setTime(e.target.value)}
        className="border-b-2 border-gray-300 focus:border-black outline-none text-lg py-2"
      />
      <button
        onClick={onSubmit}
        className="bg-black text-white py-3 rounded-full mt-4 font-bold hover:bg-gray-800 transition"
      >
        Check Weather
      </button>
    </div>
  );
};

export default WeatherForm;