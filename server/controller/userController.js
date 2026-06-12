import User from "../models/User.js";
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export const userDetails = async (req, res) => {
    try {
        // 1. The user ID comes from the decoded token (attached by middleware)
        const userId = req.user?.id;

        if (!userId) {
            return res.status(401).json({ message: "Access Denied: No token provided" });
        }

        // 2. Find the user by ID and exclude the password field
        const user = await User.findById(userId).select("-password");

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // 3. Send the user details back to your frontend
        return res.status(200).json({
            success: true,
            user
        });

    } catch (error) {
        return res.status(500).json({ message: "Server error while fetching user" });
    }
};

export const register = async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name ||!email || !password) {
            return res.status(400).json({
                message: "All fields are required",
            });
        }

        // 1. Check if user exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ message: "User Already Exists" }); // 409 Conflict
        }

        // 2. Hash password
        const hashPass = await bcrypt.hash(password, 10);

        // 3. Create user
        const user = await User.create({ name, email, password: hashPass });

        // 4. Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // 5. Respond (Sanitized user object - no password)
        return res.status(201).json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong on the server" });
    }
};

export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // 1. Find user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized for privacy
        }

        // 2. Compare password
        const compPass = await bcrypt.compare(password, user.password);
        if (!compPass) {
            return res.status(401).json({ message: "Invalid credentials" }); // 401 Unauthorized
        }

        // 3. Generate JWT
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "7d" });

        // 4. Respond
        return res.status(200).json({
            token,
            user: { id: user._id, name: user.name, email: user.email }
        });

    } catch (error) {
        return res.status(500).json({ message: "Something went wrong on the server" });
    }
};