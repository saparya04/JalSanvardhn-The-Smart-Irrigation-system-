import express from "express";
import Crop from "../models/Crop.js";

const router = express.Router();

// **Save Crop Data**
router.post("/save", async (req, res) => {
    try {
        const crop = new Crop(req.body);
        await crop.save();
        res.json({ message: "Crop data saved successfully!" });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// **Get Crop Data by User**
router.get("/:userId", async (req, res) => {
    try {
        const crops = await Crop.find({ userId: req.params.userId });
        res.json(crops);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

export default router;
