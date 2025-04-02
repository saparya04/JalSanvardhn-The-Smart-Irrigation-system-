// import { useState } from "react";
// import axios from "axios";

// const CropData = () => {
//   const [form, setForm] = useState({ cropType: "", currentStage: "", farmLocation: "", soilType: "", irrigationMethod: "", waterSource: "" });

//   const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const userId = localStorage.getItem("userId");
//     await axios.post("http://localhost:5000/api/crop/save", { ...form, userId });
//     alert("Crop data saved!");
//   };

//   return (
//     <div>
//       <h2>Enter Crop Details</h2>
//       <form onSubmit={handleSubmit}>
//         {/* Crop Type Dropdown */}
//         <label>Crop Type:</label>
//         <select name="cropType" onChange={handleChange} required>
//           <option value="">Select Crop Type</option>
//           <option value="Wheat">Wheat</option>
//           <option value="Rice">Rice</option>
//           <option value="Maize">Maize</option>
//           <option value="Soybean">Soybean</option>
//         </select>

//         {/* Crop Growth Stage Dropdown */}
//         <label>Current Stage of Crop:</label>
//         <select name="currentStage" onChange={handleChange} required>
//           <option value="">Select Stage</option>
//           <option value="Germination">Germination</option>
//           <option value="Vegetative">Vegetative</option>
//           <option value="Flowering">Flowering</option>
//           <option value="Maturity">Maturity</option>
//         </select>

//         {/* Farm Location Dropdown */}
//         <label>Farm Location:</label>
//         <select name="farmLocation" onChange={handleChange} required>
//           <option value="">Select Location</option>
//           <option value="North">North</option>
//           <option value="South">South</option>
//           <option value="East">East</option>
//           <option value="West">West</option>
//         </select>

//         {/* Soil Type Dropdown */}
//         <label>Soil Type:</label>
//         <select name="soilType" onChange={handleChange} required>
//           <option value="">Select Soil Type</option>
//           <option value="Sandy">Sandy</option>
//           <option value="Clayey">Clayey</option>
//           <option value="Loamy">Loamy</option>
//           <option value="Silty">Silty</option>
//         </select>

//         {/* Irrigation Method Dropdown */}
//         <label>Irrigation Method:</label>
//         <select name="irrigationMethod" onChange={handleChange} required>
//           <option value="">Select Irrigation Method</option>
//           <option value="Drip">Drip</option>
//           <option value="Sprinkler">Sprinkler</option>
//           <option value="Surface">Surface</option>
//           <option value="Subsurface">Subsurface</option>
//         </select>

//         {/* Water Source Dropdown */}
//         <label>Water Source:</label>
//         <select name="waterSource" onChange={handleChange} required>
//           <option value="">Select Water Source</option>
//           <option value="River">River</option>
//           <option value="Borewell">Borewell</option>
//           <option value="Rainwater">Rainwater</option>
//           <option value="Canal">Canal</option>
//         </select>

//         <button type="submit">Save Details</button>
//       </form>
//     </div>
//   );
// };

// export default CropData;

import { useState, useEffect } from "react";
import axios from "axios";
import { Container, Row, Col, Card, Form, Button } from "react-bootstrap";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import cropImage from "../farming-animation.gif"; // Ensure this image exists

const CropData = () => {
  const [form, setForm] = useState({
    cropType: "",
    currentStage: "",
    farmLocation: "",
    soilType: "",
    irrigationMethod: "",
    waterSource: ""
  });

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const userId = localStorage.getItem("userId");
    await axios.post("http://localhost:5000/api/crop/save", { ...form, userId });
    alert("Crop data saved!");
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-light">
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-lg bg-white rounded" data-aos="fade-up">
            <Row>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <motion.img 
                  src={cropImage} 
                  alt="Crop Data" 
                  className="img-fluid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                />
              </Col>
              <Col md={6}>
                <motion.h2 
                  className="text-center mb-4 fw-bold text-success"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Enter Crop Details
                </motion.h2>
                <Form onSubmit={handleSubmit}>
                  {[
                    { label: "Crop Type", name: "cropType", options: ["Wheat", "Rice", "Maize", "Soybean"] },
                    { label: "Current Stage of Crop", name: "currentStage", options: ["Germination", "Vegetative", "Flowering", "Maturity"] },
                    { label: "Farm Location", name: "farmLocation", options: ["North", "South", "East", "West"] },
                    { label: "Soil Type", name: "soilType", options: ["Sandy", "Clayey", "Loamy", "Silty"] },
                    { label: "Irrigation Method", name: "irrigationMethod", options: ["Drip", "Sprinkler", "Surface", "Subsurface"] },
                    { label: "Water Source", name: "waterSource", options: ["River", "Borewell", "Rainwater", "Canal"] }
                  ].map((field, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 }}
                    >
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">{field.label}:</Form.Label>
                        <Form.Select name={field.name} onChange={handleChange} required>
                          <option value="">Select {field.label}</option>
                          {field.options.map((option) => (
                            <option key={option} value={option}>{option}</option>
                          ))}
                        </Form.Select>
                      </Form.Group>
                    </motion.div>
                  ))}
                  <motion.div 
                    initial={{ scale: 0.8 }} 
                    animate={{ scale: 1 }} 
                    transition={{ duration: 0.3 }}
                  >
                    <Button variant="success" type="submit" className="w-100 fw-bold p-2">
                      Save Details
                    </Button>
                  </motion.div>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default CropData;
