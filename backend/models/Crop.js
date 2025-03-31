import mongoose from "mongoose";

const CropSchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    cropType: String,
    currentStage: String,
    farmLocation: String,
    soilType: String,
    irrigationMethod: String,
    waterSource: String
});

export default mongoose.model("Crop", CropSchema);
