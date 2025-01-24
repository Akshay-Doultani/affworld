import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../utils/api";

const RequestPasswordReset = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        try {
            const response = await API.post("/auth/reset-password", { email });
            setMessage(response.data.message);

            // Redirect to OTP verification page if request is successful
            if (response.status === 200) {
                navigate(`/reset-password-otp/${email}`);
            }
        } catch (error) {
            setMessage(error.response?.data?.error || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Request Password Reset</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md w-full max-w-sm">
                <input
                    type="email"
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border rounded focus:outline-none focus:ring focus:border-blue-300"
                />
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded disabled:bg-blue-300 flex items-center justify-center"
                    disabled={isLoading}
                >
                    {isLoading ? "Sending..." : "Send OTP"}
                </button>
            </form>
            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
};

export default RequestPasswordReset;
