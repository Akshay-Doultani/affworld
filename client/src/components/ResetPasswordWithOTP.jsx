import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../utils/api";

const ResetPasswordWithOTP = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [otp, setOtp] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);

    const handleVerifyOtp = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            // console.log(`Sending verification request for email: ${email}, OTP: ${otp}`); 
            const res = await API.post("/auth/verify-reset-otp", { email, otp });
            //console.log(`Verify OTP response: ${res.data.message}`); 
            if (res.status === 200) {
                setMessage("OTP verified. Redirecting to reset password page...");
                setTimeout(() => navigate(`/reset-password/${email}`), 2000);
            } else {
                setMessage(res.data.message);
            }
        } catch (err) {
            setMessage(err.response?.data?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Verify OTP</h2>
            <form onSubmit={handleVerifyOtp} className="bg-white p-6 rounded shadow-md">
                <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border rounded"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? "Verifying..." : "Verify OTP"}
                </button>
            </form>
            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
};

export default ResetPasswordWithOTP;
