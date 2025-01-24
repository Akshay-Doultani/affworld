const express = require("express");
const { register, login, resetPassword, getCurrentUser, updatePassword, verifyResetOTP } = require("../controllers/authController");
const verifyToken = require("../middlewares/authMiddleware");
const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.post("/reset-password", resetPassword);
router.put('/update-password', updatePassword);
router.post('/verify-reset-otp', verifyResetOTP);
router.get("/me", verifyToken, getCurrentUser);

module.exports = router;
