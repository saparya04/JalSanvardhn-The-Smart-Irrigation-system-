import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropType: String,
    soilType: String,
    region: String,
    weatherCondition: String,
    latitude: Number,
    longitude: Number,
    temperature: Number,
    irrigationFlowRate: Number
});

export default mongoose.model("Crop", CropSchema);
