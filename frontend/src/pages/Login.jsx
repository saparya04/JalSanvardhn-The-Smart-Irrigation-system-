import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { Form, Button, Container, Alert, Card, Row, Col } from "react-bootstrap";
import { FaEnvelope, FaLock } from "react-icons/fa";
import { motion } from "framer-motion";
import AOS from "aos";
import "aos/dist/aos.css";
import loginImage from "../assets/login-image.svg"; // Ensure this exists

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000 });
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/login", formData);
      alert("Login Successful! Redirecting...");
      navigate("/crop-data");
    } catch (err) {
      setError(err.response?.data?.error || "Invalid credentials, please try again.");
    }
  };

  return (
    <Container fluid className="d-flex align-items-center justify-content-center min-vh-100 bg-dark">
      <Row className="w-100 justify-content-center">
        <Col md={10} lg={8}>
          <Card className="p-4 shadow-lg text-dark bg-secondary rounded" data-aos="fade-up">
            <Row>
              <Col md={6} className="d-flex align-items-center justify-content-center">
                <motion.img 
                  src={loginImage} 
                  alt="Login" 
                  className="img-fluid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 2 }}
                />
              </Col>
              <Col md={6}>
                <motion.h2 
                  className="text-center mb-4 text-white fw-bold"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 1 }}
                >
                  Farmer Login
                </motion.h2>
                {error && <Alert variant="danger">{error}</Alert>}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white fw-bold"><FaEnvelope /> Email</Form.Label>
                    <Form.Control type="email" name="email" placeholder="Enter your email" onChange={handleChange} required className="p-2" />
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label className="text-white fw-bold"><FaLock /> Password</Form.Label>
                    <Form.Control type="password" name="password" placeholder="Enter password" onChange={handleChange} required className="p-2" />
                  </Form.Group>
                  <Button variant="success" type="submit" className="w-100 fw-bold p-2">Login</Button>
                </Form>
                <div className="text-center mt-3">
                  <span className="text-white">Don't have an account? </span>
                  <Button variant="link" className="text-white fw-bold" onClick={() => navigate("/Register")}>Register</Button>
                </div>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Login;
