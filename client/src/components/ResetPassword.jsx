import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import API from "../utils/api";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const ResetPassword = () => {
    const { email } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [message, setMessage] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const toggleNewPasswordVisibility = () => {
        setShowNewPassword((prevState) => !prevState);
    };

    const toggleConfirmPasswordVisibility = () => {
        setShowConfirmPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (newPassword !== confirmPassword) {
            setMessage("Passwords do not match.");
            return;
        }
        setIsLoading(true);
        try {
            const data = { email, newPassword };
            //console.log("Sending data to backend:", data);
            const res = await API.put("/auth/update-password", data);
            //console.log("Server response:", res);
            if (res.status === 200) {
                alert("Password changed successfully!");
                setMessage("Password reset successfully. Redirecting to login...");
                setTimeout(() => navigate("/login"), 2000);
            } else {
                setMessage(res.data.message);
            }
        } catch (err) {
            console.error("Error response from server:", err);
            setMessage(err.response?.data?.message || "Something went wrong.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Reset Password</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md">
                <div className="relative w-full mb-4">
                    <input
                        type={showNewPassword ? "text" : "password"}
                        placeholder="Enter your new password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                        style={{ width: '300px', height: '40px' }}
                    />
                    <button
                        type="button"
                        onClick={toggleNewPasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 text-gray-600"
                    >
                        {showNewPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <div className="relative w-full mb-4">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="Confirm your new password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                        style={{ width: '300px', height: '40px' }}
                    />
                    <button
                        type="button"
                        onClick={toggleConfirmPasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 text-gray-600"
                    >
                        {showConfirmPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 rounded"
                    disabled={isLoading}
                >
                    {isLoading ? "Processing..." : "Reset Password"}
                </button>
            </form>
            {message && <p className="mt-4 text-gray-700">{message}</p>}
        </div>
    );
};

export default ResetPassword;
