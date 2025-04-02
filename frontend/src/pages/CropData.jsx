import { useState } from "react";
import axios from "axios";

const CropData = () => {
  const [form, setForm] = useState({ cropType: "", soilType: "", region: "", weatherCondition: "", area: "" });
  const [report, setReport] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const userId = localStorage.getItem("userId");

    if (!userId) {
      setError("User ID not found. Please log in.");
      return;
    }

    try {
      const { data } = await axios.post("http://localhost:5000/api/crop/save", { ...form, userId });
      setReport(data);
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong.");
    }
  };

  return (
    <div>
      <h2>Enter Crop Details</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input type="text" name="cropType" placeholder="Crop Type" value={form.cropType} onChange={handleChange} required />
        <input type="text" name="soilType" placeholder="Soil Type" value={form.soilType} onChange={handleChange} required />
        <input type="text" name="region" placeholder="Region" value={form.region} onChange={handleChange} required />
        <input type="text" name="weatherCondition" placeholder="Weather Condition" value={form.weatherCondition} onChange={handleChange} required />
        <input type="text" name="area" placeholder="Location" value={form.area} onChange={handleChange} required />
        <button type="submit">Save Details</button>
      </form>

      {report && (
        <div>
          <h3>Report</h3>
          <p>Temperature: {report.temperature}°C</p>
          <p>Irrigation Flow Rate: {report.irrigationFlowRate}</p>
        </div>
      )}
    </div>
  );
};

export default CropData;
