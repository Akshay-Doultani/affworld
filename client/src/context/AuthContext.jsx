import React, { createContext, useState, useEffect } from "react";
import API from "../utils/api"; // Import the API utility

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true); // To manage initial loading state

    const login = async (email, password) => {
        try {
            const res = await API.post("/auth/login", { email, password });
            const { token, user } = res.data;
            localStorage.setItem("token", token); // Store the token
            setUser(user); // Set the user
        } catch (error) {
            console.error("Login failed:", error);
        }
    };

    const register = async (name, email, password) => {
        try {
            await API.post("/auth/register", { name, email, password });
        } catch (error) {
            console.error("Registration failed:", error);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    const verifyUser = async () => {
        try {
            const token = localStorage.getItem("token");
            if (!token) {
                setIsLoading(false); // Stop loading if no token is found
                return;
            }
            const res = await API.get("/auth/me", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUser(res.data); // Set the user data if the token is valid
        } catch (error) {
            console.error("Token validation failed:", error);
            logout(); // Clear session if token is invalid
        } finally {
            setIsLoading(false); // Ensure loading stops in all cases
        }
    };

    useEffect(() => {
        verifyUser(); // Run on mount to check token validity
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};
