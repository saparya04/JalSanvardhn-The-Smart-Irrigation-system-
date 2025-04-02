// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";
// import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
// import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
// import { motion } from "framer-motion";
// import Particles from "react-tsparticles";
// import { loadFull } from "tsparticles";
// import "aos/dist/aos.css";
// import registerImage from "../assets/register-image.svg"; // Ensure this image exists

// const Register = () => {
//   const [formData, setFormData] = useState({ name: "", email: "", password: "", confirmPassword: "" });
//   const [error, setError] = useState(null);
//   const [userExists, setUserExists] = useState(false);
//   const navigate = useNavigate();

//   useEffect(() => {
//     loadFull;
//   }, []);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (formData.password !== formData.confirmPassword) {
//       setError("Passwords do not match!");
//       return;
//     }
//     try {
//       await axios.post("http://localhost:5000/register", formData);
//       alert("Registration Successful! Redirecting to login.");
//       navigate("/Login");
//     } catch (err) {
//       if (err.response?.data?.error === "Email already exists") {
//         setUserExists(true);
//       } else {
//         setError(err.response?.data?.error || "An unexpected error occurred.");
//       }
//     }
//   };

//   return (
//     <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
//       <Particles
//         id="tsparticles"
//         init={loadFull}
//         options={{
//           background: { color: "#000000" },
//           particles: {
//             number: { value: 50 },
//             size: { value: 3 },
//             move: { enable: true, speed: 2 },
//             color: { value: "#ffffff" },
//             opacity: { value: 0.7 },
//           },
//         }}
//       />

//       <Row className="w-100 justify-content-center position-relative">
//         <Col md={10} lg={8}>
//           <Card className="p-4 shadow-lg rounded" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
//             <Row>
//               <Col md={6} className="d-flex align-items-center justify-content-center">
//                 <img src={registerImage} alt="Register" className="img-fluid" />
//               </Col>
//               <Col md={6}>
//                 <motion.h2
//                   className="text-center mb-4 text-success fw-bold"
//                   initial={{ opacity: 0 }}
//                   animate={{ opacity: 1 }}
//                   transition={{ duration: 2 }}
//                 >
//                   Farmer Registration
//                 </motion.h2>

//                 {error && <Alert variant="danger" className="text-center">{error}</Alert>}
//                 {userExists && (
//                   <Alert variant="warning" className="text-center">
//                     User already exists! <Button variant="link" onClick={() => navigate("/login")}>Go to Login</Button>
//                   </Alert>
//                 )}

//                 <Form onSubmit={handleSubmit}>
//                   <Form.Group className="mb-3">
//                     <Form.Label><FaUser /> Name</Form.Label>
//                     <Form.Control type="text" name="name" placeholder="Enter your name" onChange={handleChange} required />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label><FaEnvelope /> Email</Form.Label>
//                     <Form.Control type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label><FaLock /> Password</Form.Label>
//                     <Form.Control type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
//                   </Form.Group>

//                   <Form.Group className="mb-3">
//                     <Form.Label><FaLock /> Confirm Password</Form.Label>
//                     <Form.Control type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleChange} required />
//                   </Form.Group>

//                   <Button variant="success" type="submit" className="w-100">Register</Button>
//                 </Form>

//                 <div className="text-center mt-3">
//                   <span>Already have an account? </span>
//                   <Button variant="link" onClick={() => navigate("/login")}>Login</Button>
//                 </div>
//               </Col>
//             </Row>
//           </Card>
//         </Col>
//       </Row>
//     </Container>
//   );
// };

// export default Register;


import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Card, Row, Col, Alert } from "react-bootstrap";
import { FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import registerImage from "../assets/register-image.svg"; // Ensure this image exists

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [success, setSuccess] = useState(false);
  const [emailExists, setEmailExists] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setEmailExists(false);
    setLoading(true);

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match!");
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:5000/api/auth/register", form);
      
      if (response.status === 201) {
        setSuccess(true);
        setTimeout(() => navigate("/login"), 2000); // Redirect after 2 seconds
      }
    } catch (err) {
      console.error("Registration Error:", err.response?.data || err.message);
      if (err.response?.data?.error === "Email already exists") {
        setEmailExists(true);
      } else {
        setError(err.response?.data?.error || "Unexpected error occurred.");
      }
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <Row className="w-100 justify-content-center position-relative">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-lg rounded" style={{ backgroundColor: "#f8f9fa", border: "none" }}>
            <Row>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <img src={registerImage} alt="Register" className="img-fluid" />
              </Col>
              <Col md={6}>
                <motion.h2
                  className="text-center mb-4 text-success fw-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                >
                  Farmer Registration
                </motion.h2>

                {/* Success Message */}
                {success && (
                  <Alert variant="success" className="text-center">
                    Registration successful! Redirecting to login...
                  </Alert>
                )}

                {/* Show error message if email already exists */}
                {emailExists && (
                  <Alert variant="warning" className="text-center">
                    Email already registered! <Button variant="link" onClick={() => navigate("/login")}>Go to Login</Button>
                  </Alert>
                )}

                {/* Show generic error messages */}
                {error && <Alert variant="danger" className="text-center">{error}</Alert>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label><FaUser /> Name</Form.Label>
                    <Form.Control type="text" name="name" placeholder="Enter your name" onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaEnvelope /> Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter your email" onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaLock /> Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter password" onChange={handleChange} required />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label><FaLock /> Confirm Password</Form.Label>
                    <Form.Control type="password" name="confirmPassword" placeholder="Confirm password" onChange={handleChange} required />
                  </Form.Group>

                  <Button variant="success" type="submit" className="w-100" style={{ fontWeight: "bold", borderRadius: "5px" }} disabled={loading}>
                    {loading ? "Registering..." : "Register"}
                  </Button>
                </Form>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register;
