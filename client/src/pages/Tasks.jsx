import React, { useContext, useState } from "react";
import { TaskContext } from "../context/TaskContext";
import { CheckIcon, TrashIcon } from "@heroicons/react/outline";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from 'react-icons/fa';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

const Tasks = () => {
    const { tasks, createTask, updateTask, deleteTask } = useContext(TaskContext);
    const [newTask, setNewTask] = useState({
        title: "",
        description: "",
        status: "pending",
    });
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleCreate = async () => {
        if (newTask.title && newTask.description) {
            setLoading(true);

            try {
                await createTask(newTask); // This uses the createTask function from context

                setNewTask({ title: "", description: "", status: "pending" });

                setTimeout(() => {
                    setLoading(false);
                    window.location.reload(); // Optional, you can handle this more gracefully
                }, 2000);
            } catch (error) {
                console.error("Failed to save task to the backend:", error);
                setLoading(false);
            }
        }
    };

    const handleUpdate = async (taskId, newStatus) => {
        setLoading(true);
        try {
            await updateTask(taskId, { status: newStatus }); // This uses the updateTask function from context
            setLoading(false);
        } catch (error) {
            console.error("Failed to update task:", error);
            setLoading(false);
        }
    };

    const handleDelete = async (taskId) => {
        if (window.confirm("Are you sure you want to delete this task?")) {
            setLoading(true);
            try {
                await deleteTask(taskId); // This uses the deleteTask function from context
                setLoading(false);
            } catch (error) {
                console.error("Failed to delete task:", error);
                setLoading(false);
            }
        }
    };

    const handleDragEnd = (result) => {
        if (!result.destination) return;

        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const taskId = result.draggableId;
            const newStatus = destination.droppableId;
            handleUpdate(taskId, newStatus); // This uses the updateTask function from context
        }
    };

    return (
        <div className="max-w-4xl mx-auto py-6 px-4">
            <div className="flex justify-between mb-6">
                <button
                    onClick={() => navigate('/profile')}
                    className="text-blue-500 flex items-center mb-6"
                >
                    <FaArrowLeft className="mr-2" /> Go to Profile
                </button>
            </div>
            <h1 className="text-3xl font-bold text-center mb-6">Task Management</h1>
            <div className="bg-white p-6 rounded-lg shadow-lg mb-6">
                <h2 className="text-xl font-semibold mb-4">Create a New Task</h2>
                <div className="space-y-4">
                    <input
                        type="text"
                        placeholder="Task Title"
                        value={newTask.title}
                        onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <textarea
                        placeholder="Task Description"
                        value={newTask.description}
                        onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                        className="w-full p-3 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                        onClick={handleCreate}
                        className="w-full bg-blue-500 text-white py-3 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        Create Task
                    </button>
                </div>
            </div>

            {loading && <div className="text-center mb-4">Loading...</div>}

            <DragDropContext onDragEnd={handleDragEnd}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Droppable droppableId="pending">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="p-4 bg-gray-100 rounded-lg"
                            >
                                <h2 className="text-xl font-semibold mb-4">Pending</h2>
                                {tasks.filter(task => task.status === "pending").length === 0 && !loading && (
                                    <div className="text-center text-gray-500">No pending tasks available.</div>
                                )}
                                {tasks.filter(task => task.status === "pending").map((task, index) => (
                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-4 rounded-lg shadow-md mb-4"
                                            >
                                                <h3 className="text-xl font-semibold">{task.title}</h3>
                                                <p className="text-gray-600">{task.description}</p>
                                                <p className="text-yellow-500 text-sm font-medium">Status: Pending</p>
                                                <div className="flex space-x-4 mt-4">
                                                    <button
                                                        onClick={() => handleUpdate(task._id, "completed")}
                                                        className="text-green-500 hover:text-green-600"
                                                    >
                                                        <CheckIcon className="w-6 h-6" />
                                                    </button>
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <TrashIcon className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>

                    <Droppable droppableId="completed">
                        {(provided) => (
                            <div
                                ref={provided.innerRef}
                                {...provided.droppableProps}
                                className="p-4 bg-gray-100 rounded-lg"
                            >
                                <h2 className="text-xl font-semibold mb-4">Completed</h2>
                                {tasks.filter(task => task.status === "completed").length === 0 && !loading && (
                                    <div className="text-center text-gray-500">No completed tasks available.</div>
                                )}
                                {tasks.filter(task => task.status === "completed").map((task, index) => (
                                    <Draggable key={task._id} draggableId={task._id} index={index}>
                                        {(provided) => (
                                            <div
                                                ref={provided.innerRef}
                                                {...provided.draggableProps}
                                                {...provided.dragHandleProps}
                                                className="bg-white p-4 rounded-lg shadow-md mb-4"
                                            >
                                                <h3 className="text-xl font-semibold">{task.title}</h3>
                                                <p className="text-gray-600">{task.description}</p>
                                                <p className="text-green-500 text-sm font-medium">Status: Completed</p>
                                                <div className="flex space-x-4 mt-4">
                                                    <button
                                                        onClick={() => handleDelete(task._id)}
                                                        className="text-red-500 hover:text-red-600"
                                                    >
                                                        <TrashIcon className="w-6 h-6" />
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </Draggable>
                                ))}
                                {provided.placeholder}
                            </div>
                        )}
                    </Droppable>
                </div>
            </DragDropContext>
        </div>
    );
};

export default Tasks;
