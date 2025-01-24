const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const transporter = require('../config/transporter');
const crypto = require("crypto");

const NodeCache = require('node-cache');
const otpCache = new NodeCache({ stdTTL: 3600, checkperiod: 120 }); // OTPs valid for 1 hour


// Register a user
async function register(req, res) {
    try {
        const { name, email, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({ name, email, password: hashedPassword });
        await user.save();
        res.status(201).json({ message: "User registered successfully" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Login a user
async function login(req, res) {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });
        if (!user) return res.status(404).json({ message: "User not found" });

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({ token, user: { id: user._id, name: user.name, email: user.email } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
}

// Get current user details
const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// Send reset password email
async function resetPassword(req, res) {
    {
        try {
            const { email } = req.body;

            // Generate OTP
            const otp = crypto.randomInt(100000, 999999).toString();

            // Store OTP in cache with email as the key
            otpCache.set(email, otp);

            console.log(`OTP generated for ${email}: ${otp}, stored in cache`);

            // Send OTP to user's email
            const mailOptions = {
                from: process.env.EMAIL,
                to: email,
                subject: "Password Reset OTP",
                html: `<p>Your OTP for password reset is: <strong>${otp}</strong></p>
                     <p>If you did not request this, please ignore this email.</p>`,
            };

            await transporter.sendMail(mailOptions);
            console.log(`OTP sent to ${email}`); // Log after sending OTP

            res.status(200).json({ message: "Password reset OTP sent" });
        } catch (err) {
            console.error(err);
            res.status(500).json({ error: "Something went wrong, please try again." });
        }
    }
}



// Update the password after reset
async function updatePassword(req, res) {
    try {
        console.log("Incoming request data:", req.body);
        const { email, newPassword } = req.body;

        if (!newPassword) {
            return res.status(400).json({ message: "New password is required" });
        }

        const user = await User.findOne({ email: email });

        if (!user) {
            return res.status(400).json({ message: "User not found" });
        }

        // Hash the new password before saving it
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        user.password = hashedPassword;

        await user.save();
        res.status(200).json({ message: "Password updated successfully" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong, please try again." });
    }
}



const verifyResetOTP = async (req, res) => {
    try {
        const { email, otp } = req.body;

        console.log(`Verifying OTP for ${email}, OTP: ${otp}`);

        // Retrieve OTP from cache
        const cachedOtp = otpCache.get(email);

        if (!cachedOtp || cachedOtp !== otp) {
            console.log(`Verification failed. No OTP found or OTP mismatch for ${email}.`);
            return res.status(400).json({ message: "Invalid or expired OTP" });
        }

        console.log(`OTP verified successfully for ${email}`);
        res.status(200).json({ message: "OTP verified" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: "Something went wrong, please try again." });
    }
};





module.exports = { register, login, resetPassword, updatePassword, getCurrentUser, verifyResetOTP };
