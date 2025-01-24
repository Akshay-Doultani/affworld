import React, { useState, useContext, useEffect } from "react";
import { AuthContext } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
    const { user, login } = useContext(AuthContext);
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    useEffect(() => {
        if (user) {
            navigate("/feed", { replace: true });
        }
    }, [user, navigate]);

    const togglePasswordVisibility = () => {
        setShowPassword((prevState) => !prevState);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            //console.log("Logging in with:", email, password);
            await login(email, password);
            navigate("/feed");
        } catch (err) {
            console.error("Error during login:", err);
            setError(err.response?.data?.message || "Invalid login credentials");
        }
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
            <h2 className="text-xl font-bold mb-4">Login</h2>
            <form onSubmit={handleSubmit} className="bg-white p-6 rounded shadow-md" style={{ width: '400px' }}> {/* Adjusted form size */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    className="w-full p-2 mb-4 border rounded"
                    style={{ width: '350px', height: '45px' }}
                />
                <div className="relative w-full mb-4">
                    <input
                        type={showPassword ? "text" : "password"}
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="w-full p-2 border rounded"
                        style={{ width: '350px', height: '45px' }}
                    />
                    <button
                        type="button"
                        onClick={togglePasswordVisibility}
                        className="absolute inset-y-0 right-0 px-3 text-gray-600"
                    >
                        {showPassword ? <FaEyeSlash /> : <FaEye />}
                    </button>
                </div>
                {error && <p className="text-red-500">{error}</p>}
                <button type="submit" className="w-full bg-blue-500 text-white py-2 rounded mb-4">
                    Login
                </button>
                <p className="text-sm text-gray-600">
                    Don't have an account?{" "}
                    <Link to="/register" className="text-blue-500 hover:underline">
                        Sign up here
                    </Link>
                </p>
                <p className="text-sm text-gray-600 mt-2">
                    Forgot your password?{" "}
                    <Link to="/request-reset-password" className="text-blue-500 hover:underline">
                        Reset it here
                    </Link>
                </p>
            </form>
        </div>
    );
};

export default Login;
