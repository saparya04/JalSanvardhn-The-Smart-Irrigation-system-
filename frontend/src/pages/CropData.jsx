import { useState } from "react";
import axios from "axios";

const CropData = () => {
  const [form, setForm] = useState({ cropType: "", currentStage: "", farmLocation: "", soilType: "", irrigationMethod: "", waterSource: "" });

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    await axios.post("http://localhost:5000/api/crop/save", { ...form, userId });
    alert("Crop data saved!");
  };

  return (
    <div>
      <h2>Enter Crop Details</h2>
      <form onSubmit={handleSubmit}>
        {/* Crop Type Dropdown */}
        <label>Crop Type:</label>
        <select name="cropType" onChange={handleChange} required>
          <option value="">Select Crop Type</option>
          <option value="Wheat">Wheat</option>
          <option value="Rice">Rice</option>
          <option value="Maize">Maize</option>
          <option value="Soybean">Soybean</option>
        </select>

        {/* Crop Growth Stage Dropdown */}
        <label>Current Stage of Crop:</label>
        <select name="currentStage" onChange={handleChange} required>
          <option value="">Select Stage</option>
          <option value="Germination">Germination</option>
          <option value="Vegetative">Vegetative</option>
          <option value="Flowering">Flowering</option>
          <option value="Maturity">Maturity</option>
        </select>

        {/* Farm Location Dropdown */}
        <label>Farm Location:</label>
        <select name="farmLocation" onChange={handleChange} required>
          <option value="">Select Location</option>
          <option value="North">North</option>
          <option value="South">South</option>
          <option value="East">East</option>
          <option value="West">West</option>
        </select>

        {/* Soil Type Dropdown */}
        <label>Soil Type:</label>
        <select name="soilType" onChange={handleChange} required>
          <option value="">Select Soil Type</option>
          <option value="Sandy">Sandy</option>
          <option value="Clayey">Clayey</option>
          <option value="Loamy">Loamy</option>
          <option value="Silty">Silty</option>
        </select>

        {/* Irrigation Method Dropdown */}
        <label>Irrigation Method:</label>
        <select name="irrigationMethod" onChange={handleChange} required>
          <option value="">Select Irrigation Method</option>
          <option value="Drip">Drip</option>
          <option value="Sprinkler">Sprinkler</option>
          <option value="Surface">Surface</option>
          <option value="Subsurface">Subsurface</option>
        </select>

        {/* Water Source Dropdown */}
        <label>Water Source:</label>
        <select name="waterSource" onChange={handleChange} required>
          <option value="">Select Water Source</option>
          <option value="River">River</option>
          <option value="Borewell">Borewell</option>
          <option value="Rainwater">Rainwater</option>
          <option value="Canal">Canal</option>
        </select>

        <button type="submit">Save Details</button>
      </form>
    </div>
  );
};

export default CropData;

