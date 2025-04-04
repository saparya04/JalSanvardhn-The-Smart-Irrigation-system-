import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropType: String,
    cropDays: Number,
    latitude: Number,
    longitude: Number,
    temperature: Number,
    humidity: Number,
    soilMoisture: Number,
    irrigationRequired: Boolean
});

export default mongoose.model("Crop", CropSchema);
