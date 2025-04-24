import React, { useState, useEffect, useRef } from "react";
import "../css/Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import cloud_icon from "../assets/cloud.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

const allIcons = {
  "01d": clear_icon,
  "01n": clear_icon,
  "02d": cloud_icon,
  "02n": cloud_icon,
  "03d": cloud_icon,
  "03n": cloud_icon,
  "04d": drizzle_icon,
  "04n": drizzle_icon,
  "09d": rain_icon,
  "09n": rain_icon,
  "10d": rain_icon,
  "10n": rain_icon,
  "13d": snow_icon,
  "13n": snow_icon,
};

const Weather = () => {
  const [weather, setWeather] = useState(false);
  const [popupMessage, setPopupMessage] = useState("");
  const inputRef = useRef();

  const search = async (city) => {
    if (!city) {
      setPopupMessage("Please enter a city name.");
      return;
    }

    try {
      const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${import.meta.env.VITE_APP_ID}`;
      const response = await fetch(url);
      const data = await response.json();

      if (!response.ok) {
        setPopupMessage("City not found. Please try again.");
        return;
      }

      const icon = allIcons[data.weather[0].icon];
      setWeather({
        humidity: data.main.humidity,
        windspeed: data.wind.speed,
        temprature: Math.floor(data.main.temp),
        location: data.name,
        icon: icon,
      });
      setPopupMessage(""); // clear any popup
    } catch (error) {
      console.error(error);
      setPopupMessage("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    search("Lahore");
  }, []);

  return (
    <div className="weather-container">
      {popupMessage && (
        <div className="popup">
          <div className="popup-inner">
            <p>{popupMessage}</p>
            <button onClick={() => setPopupMessage("")}>Close</button>
          </div>
        </div>
      )}

      <div className="search-bar">
        <input
          ref={inputRef}
          type="text"
          placeholder="Search"
          className="search-input"
        />
        <img
          src={search_icon}
          alt="Search Icon"
          className="search-icon"
          onClick={() => search(inputRef.current.value)}
        />
      </div>

      {weather && (
        <>
          <div className="weather-display">
            <img src={weather.icon} alt="Weather Icon" className="weather-icon" />
            <p className="temperature">{weather.temprature}°C</p>
            <p className="location">{weather.location}</p>
          </div>

          <div className="weather-data">
            <div className="weather-info">
              <img
                src={humidity_icon}
                alt="Humidity Icon"
                className="weather-sub-icon"
              />
              <div className="weather-details">
                <p>{weather.humidity}%</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="weather-info">
              <img
                src={wind_icon}
                alt="Wind Icon"
                className="weather-sub-icon"
              />
              <div className="weather-details">
                <p>{weather.windspeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default Weather;
