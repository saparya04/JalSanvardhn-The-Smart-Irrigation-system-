import express from "express";
import Crop from "../models/Crop.js";
import axios from "axios";

const router = express.Router();

// Fetch Weather Data (Temperature & Humidity)
const getWeatherData = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${process.env.OPEN_METEO_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true&hourly=relative_humidity_2m`);

        console.log("🌦️ Weather API Response:", response.data);

        const temperature = response.data.current_weather?.temperature;
        let humidity = response.data.current_weather?.relative_humidity;

        // If current_weather doesn't contain humidity, fallback to hourly
        if (humidity === undefined && response.data.hourly?.relative_humidity_2m?.length) {
            humidity = response.data.hourly.relative_humidity_2m[0]; // take first hour as fallback
        }

        if (temperature === undefined || humidity === undefined) {
            console.error("❌ Missing temperature or humidity in weather API response");
            return null;
        }

        return {
            temperature: Math.round(temperature),
            humidity: Math.round(humidity)
        };
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return null;
    }
};

// Fetch Soil Moisture Data
const getSoilMoisture = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${process.env.WEATHERBIT_API}?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_KEY}`);

        const moisture = response.data.data?.[0]?.soilm_10_40cm;
        if (moisture === undefined || isNaN(moisture)) {
            console.error("❌ Soil moisture data missing or invalid");
            return null;
        }

        return Math.round(moisture);
    } catch (error) {
        console.error("Error fetching soil moisture data:", error.message);
        return null;
    }
};

// Save Crop Data and Predict Irrigation
router.post("/save", async (req, res) => {
    try {
        const { cropType, cropDays, area, userId } = req.body;

        if (!cropType || !cropDays || !area || !userId) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        // Fetch coordinates using OpenStreetMap
        const locationData = await axios.get(`https://nominatim.openstreetmap.org/search?q=${area}&format=json`);
        if (!locationData.data.length) {
            return res.status(400).json({ error: "Invalid location" });
        }

        const { lat, lon } = locationData.data[0];

        // Fetch weather data
        const weatherData = await getWeatherData(lat, lon);
        if (!weatherData || isNaN(weatherData.temperature) || isNaN(weatherData.humidity)) {
            return res.status(500).json({ error: "Failed to fetch valid weather data (temperature or humidity)" });
        }

        // Fetch soil moisture
        const soilMoisture = await getSoilMoisture(lat, lon);
        if (soilMoisture === null || isNaN(soilMoisture)) {
            return res.status(500).json({ error: "Failed to fetch valid soil moisture data" });
        }

        // Call Flask API for irrigation prediction
        const flaskResponse = await axios.post("http://127.0.0.1:5002/predict", {
            cropType,
            cropDays,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            soilMoisture
        }).catch(err => {
            throw new Error(`Flask API Error: ${err.response?.data?.error || err.message}`);
        });

        const irrigationRequired = flaskResponse.data["Irrigation Required"];

        // Save to DB
        const crop = new Crop({
            userId,
            cropType,
            cropDays,
            latitude: lat,
            longitude: lon,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            soilMoisture,
            irrigationRequired
        });

        await crop.save();

        res.json({
            message: "Crop data saved successfully!",
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            soilMoisture,
            irrigationRequired
        });

    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

export default router;

