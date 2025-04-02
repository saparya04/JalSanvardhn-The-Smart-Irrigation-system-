import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";

const router = express.Router();

const generateToken = (user) => {
    return jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1h" });
};

// **Register Route**
router.post("/register", async (req, res) => {
    const { name, email, password, confirmPassword} = req.body;

    if (!name || !email || !password || !confirmPassword)
        return res.status(400).json({ error: "All fields are required" });

    if (password !== confirmPassword)
        return res.status(400).json({ error: "Passwords do not match" });

    const hashedPassword = await bcrypt.hash(password, 10);

    try {
        const newUser = new User({ name, email, password: hashedPassword});
        await newUser.save();
        res.json({ message: "User registered successfully" });
    } catch (error) {
        res.status(400).json({ error: "Email already exists" });
    }
});

// **Login Route**
router.post("/login", async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) return res.status(400).json({ error: "User not found, please register first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ error: "Invalid credentials" });

    const token = generateToken(user);
    res.cookie("token", token, { httpOnly: true, secure: false });
    res.json({ message: "Login successful", userId: user._id });
});

// **Logout Route**
router.post("/logout", (req, res) => {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
});

export default router;