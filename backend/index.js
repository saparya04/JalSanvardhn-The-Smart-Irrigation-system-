

import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();
const app = express();
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));
app.use(cookieParser());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log("MongoDB Connected")).catch(err => console.log(err));

const UserSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  role: String
});
const User = mongoose.model("User", UserSchema);

const generateToken = (user) => {
  return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// **Register Route**
app.post("/register", async (req, res) => {
  const { name, email, password, confirmPassword, role } = req.body;

  if (!name || !email || !password || !confirmPassword || !role) 
    return res.status(400).json({ error: "All fields are required" });

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) return res.status(400).json({ error: "Invalid email format" });

  const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  if (!passwordRegex.test(password)) 
    return res.status(400).json({ error: "Password must contain 1 uppercase, 1 lowercase, 1 number, 1 special character, and be at least 8 characters long" });

  if (password !== confirmPassword) 
    return res.status(400).json({ error: "Passwords do not match" });

  const hashedPassword = await bcrypt.hash(password, 10);

  try {
    const newUser = new User({ name, email, password: hashedPassword, role });
    await newUser.save();
    res.json({ message: "User registered successfully" });
  } catch (error) {
    res.status(400).json({ error: "Email already exists" });
  }
});

// **Login Route**
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });

  if (!user) return res.status(400).json({ error: "User not found, please register first" });

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

  const token = generateToken(user);
  res.cookie("token", token, { httpOnly: true, secure: false });
  res.json({ message: "Login successful" });
});

// **Logout Route**
app.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out successfully" });
});

// **Start Server**
app.listen(5000, () => console.log("Server running on port 5000"));
