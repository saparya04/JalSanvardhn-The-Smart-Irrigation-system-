import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Register";
import Login from "./pages/Login";
import "bootstrap/dist/css/bootstrap.min.css";
import "aos/dist/aos.css";
import { useEffect } from "react";
import AOS from "aos";
import gsap from "gsap";

function App() {
  useEffect(() => {
    AOS.init({ duration: 1000 });

    // Example GSAP Animation (Optional)
    gsap.from(".main-content", { opacity: 1, y: 50, duration: 1 });
  }, []);

  return (
    <Router>
      <div className="main-content">
        <Routes>
          <Route path="/" element={<Register />} />
          <Route path="/login" element={<Login />} />
        </Routes>
      </div>
    </Router>
  );
}
export default App;
