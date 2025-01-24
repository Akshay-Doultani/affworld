const Task = require("../models/Tasks");

// Create a new task
const createTask = async (req, res) => {
    try {
        const { title, description, status = "pending", dueDate } = req.body;

        const task = new Task({
            title,
            description,
            status,
            dueDate,
            userId: req.user.id, // User ID is added from the verifyToken middleware
        });

        await task.save();

        res.status(201).json({
            message: "Task created successfully",
            task,
        });
    } catch (err) {
        res.status(500).json({
            message: "Failed to create task",
            error: err.message,
        });
    }
};

// Get all tasks for the logged-in user
const getTasks = async (req, res) => {
    try {
        const tasks = await Task.find({ userId: req.user.id });
        res.status(200).json(tasks);
    } catch (err) {
        res.status(500).json({
            message: "Failed to fetch tasks",
            error: err.message,
        });
    }
};

// Update a task
const updateTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const updatedTask = await Task.findByIdAndUpdate(
            taskId,
            { ...req.body },
            { new: true, runValidators: true }
        );
        if (!updatedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json(updatedTask);
    } catch (err) {
        res.status(500).json({
            message: "Failed to update task",
            error: err.message,
        });
    }
};

// Delete a task
const deleteTask = async (req, res) => {
    try {
        const { taskId } = req.params;
        const deletedTask = await Task.findByIdAndDelete(taskId);
        if (!deletedTask) return res.status(404).json({ message: "Task not found" });
        res.status(200).json({ message: "Task deleted successfully" });
    } catch (err) {
        res.status(500).json({
            message: "Failed to delete task",
            error: err.message,
        });
    }
};

// Exporting functions as named exports
module.exports = {
    createTask,
    getTasks,
    updateTask,
    deleteTask
};
