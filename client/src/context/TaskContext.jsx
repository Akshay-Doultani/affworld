import React, { createContext, useState, useEffect, useContext } from "react";
import API from "../utils/api";
import { AuthContext } from "./AuthContext";

export const TaskContext = createContext();

export const TaskProvider = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchTasks = async () => {
        if (!user) return;  // Don't fetch tasks if no user is logged in
        setLoading(true);
        try {
            const res = await API.get("/tasks", {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTasks(res.data);
        } catch (err) {
            console.error("Failed to fetch tasks", err);
        } finally {
            setLoading(false);
        }
    };

    const createTask = async (taskData) => {
        try {
            const res = await API.post("/tasks", taskData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTasks((prevTasks) => [...prevTasks, res.data]);
        } catch (err) {
            console.error("Failed to create task", err);
        }
    };

    const updateTask = async (taskId, updatedData) => {
        try {
            const res = await API.put(`/tasks/${taskId}`, updatedData, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTasks((prevTasks) =>
                prevTasks.map((task) =>
                    task._id === taskId ? { ...task, ...updatedData } : task
                )
            );
        } catch (err) {
            console.error("Failed to update task", err);
        }
    };

    const deleteTask = async (taskId) => {
        try {
            await API.delete(`/tasks/${taskId}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
            });
            setTasks((prevTasks) => prevTasks.filter((task) => task._id !== taskId));
        } catch (err) {
            console.error("Failed to delete task", err);
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [user]);

    return (
        <TaskContext.Provider value={{ tasks, loading, createTask, updateTask, deleteTask }}>
            {children}
        </TaskContext.Provider>
    );
};
