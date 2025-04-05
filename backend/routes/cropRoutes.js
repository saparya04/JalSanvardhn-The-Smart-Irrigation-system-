import express from "express";
import Crop from "../models/Crop.js";
import axios from "axios";

const router = express.Router();

// Fetch Weather Data (Temperature & Humidity)
const getWeatherData = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${process.env.OPEN_METEO_API}?latitude=${latitude}&longitude=${longitude}&current=temperature_2m,relative_humidity_2m`);
        return {
            temperature: Math.round(response.data.current.temperature_2m),
            humidity: Math.round(response.data.current.relative_humidity_2m)
        };
    } catch (error) {
        throw new Error('Failed to fetch weather data');
    }
};    

// Fetch Soil Moisture Data
const getSoilMoisture = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${process.env.WEATHERBIT_API}?lat=${latitude}&lon=${longitude}&key=${process.env.WEATHERBIT_KEY}`);
        return{
            soilMoisture: Math.round(response.data.data[0].soilm_10_40cm) 
        };
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

        // Fetch latitude and longitude using OpenStreetMap API
        const locationData = await axios.get(`https://nominatim.openstreetmap.org/search?q=${area}&format=json`);
        if (!locationData.data.length) {
            return res.status(400).json({ error: "Invalid location" });
        }
        
        const { lat, lon } = locationData.data[0];

        // Fetch weather data
        const weatherData = await getWeatherData(lat, lon);
        if (!weatherData) {
            return res.status(500).json({ error: "Failed to fetch weather data" });
        }

        // Fetch soil moisture
        const soilMoisture = await getSoilMoisture(lat, lon);
        if (soilMoisture === null) {
            return res.status(500).json({ error: "Failed to fetch soil moisture data" });
        }

        // Call Flask API for irrigation prediction
        const predictionData = {
            cropType,
            cropDays,
            temperature: weatherData.temperature,
            humidity: weatherData.humidity,
            soilMoisture: soilMoisture.soilMoisture
        };

        // 🔍 Print data being sent to Flask API
        console.log("Data sent to Flask API:", predictionData);

        // Call Flask API for irrigation prediction
        const flaskResponse = await axios.post("http://127.0.0.1:5001/predict", predictionData).catch(err => {
            throw new Error(`Flask API Error: ${err.response?.data?.error || err.message}`);
        });


        const irrigationRequired = flaskResponse.data["Irrigation Required"];

        // Save to database
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
