import express from "express";
import Crop from "../models/Crop.js";
import axios from "axios";

const router = express.Router();

// Fetch Weather Data
const getWeatherData = async (latitude, longitude) => {
    try {
        const response = await axios.get(`${process.env.OPEN_METEO_API}?latitude=${latitude}&longitude=${longitude}&current_weather=true`);
        return response.data.current_weather.temperature;
    } catch (error) {
        console.error("Error fetching weather data:", error.message);
        return null;
    }
};

// Save Crop Data and Predict Irrigation
router.post("/save", async (req, res) => {
    try {
        const { cropType, soilType, region, weatherCondition, area, userId } = req.body;
        if (!cropType || !soilType || !region || !weatherCondition || !area || !userId) {
            return res.status(400).json({ error: "All fields are required!" });
        }

        const locationData = await axios.get(`https://nominatim.openstreetmap.org/search?q=${area}&format=json`);
        
        if (!locationData.data.length) {
            return res.status(400).json({ error: "Invalid location" });
        }

        const { lat, lon } = locationData.data[0];
        const temperature = await getWeatherData(lat, lon);
        if (temperature === null) {
            return res.status(500).json({ error: "Failed to fetch temperature" });
        }

        // Call Flask API
        const flaskResponse = await axios.post("http://127.0.0.1:5001/predict", {
            cropType, soilType, region, weatherCondition, temperature
        }).catch(err => {
            throw new Error(`Flask API Error: ${err.response?.data?.error || err.message}`);
        });

        const irrigationFlowRate = flaskResponse.data["Predicted Water Requirement"];

        const crop = new Crop({ userId, cropType, soilType, region, weatherCondition, latitude: lat, longitude: lon, temperature, irrigationFlowRate });
        await crop.save();

        res.json({ message: "Crop data saved successfully!", temperature, irrigationFlowRate });
    } catch (error) {
        console.error("Error:", error.message);
        res.status(400).json({ error: error.message });
    }
});

export default router;
