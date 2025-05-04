import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import CreateTask from './createTask';

const apiUrl = import.meta.env.VITE_API_URL;

const ShowTasks = () => {
    const { id } = useParams(); // Access the project ID from the URL
    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editingTask, setEditingTask] = useState(null);

    const fetchTasks = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/tasks/get-tasks/${id}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Failed to fetch tasks');
            } else {
                setTasks(result.data.tasks);
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async (taskId, updatedData) => {
        try {
            const response = await fetch(`${apiUrl}/api/tasks/update-task/${taskId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedData),
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Failed to update task');
            } else {
                toast.success('Task updated successfully!');
                fetchTasks(); // Refresh the task list
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    const handleEdit = (task) => {
        setEditingTask(task);
    };

    const handleCancelEdit = () => {
        setEditingTask(null);
    };

    const handleDelete = async (taskId) => {
        try {
            const response = await fetch(`${apiUrl}/api/tasks/delete-task/${taskId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            const result = await response.json();

            if (!response.ok) {
                toast.error(result.message || 'Failed to delete task');
            } else {
                toast.success('Task deleted successfully!');
                fetchTasks(); // Refresh the task list
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.');
        }
    };

    useEffect(() => {
        fetchTasks();
    }, [id]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <>
            <CreateTask onTaskCreated={fetchTasks} />
            <div className="p-6 bg-gradient-to-r from-blue-100 to-purple-100 min-h-screen">
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Tasks for Project</h2>
                {tasks.length === 0 ? (
                    <p className="text-center text-gray-600">No tasks found.</p>
                ) : (
                    <ul className="space-y-4">
                        {tasks.map(task => (
                            <li key={task._id} className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition">
                                {editingTask && editingTask._id === task._id ? (
                                    <div>
                                        <input
                                            type="text"
                                            className="w-full px-4 py-2 border rounded mb-2"
                                            defaultValue={task.title}
                                            onChange={(e) => setEditingTask({ ...editingTask, title: e.target.value })}
                                        />
                                        <textarea
                                            className="w-full px-4 py-2 border rounded mb-2"
                                            defaultValue={task.description}
                                            onChange={(e) => setEditingTask({ ...editingTask, description: e.target.value })}
                                        ></textarea>
                                        <div className="flex space-x-4">
                                            <button
                                                onClick={() => handleUpdate(task._id, editingTask)}
                                                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                                            >
                                                Save
                                            </button>
                                            <button
                                                onClick={handleCancelEdit}
                                                className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 transition"
                                            >
                                                Cancel
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <>
                                        <h3 className="text-xl font-bold text-gray-800">{task.title}</h3>
                                        <p className="text-gray-600 mt-2">{task.description}</p>
                                        <p className="text-gray-500 mt-4">
                                            <strong>Status:</strong> {task.status}
                                        </p>
                                        <div className="flex space-x-4 mt-4">
                                            <button
                                                onClick={() => handleUpdate(task._id, { status: 'todo' })}
                                                className={`px-4 py-2 rounded ${task.status === 'todo' ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                                            >
                                                Todo
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(task._id, { status: 'in-progress' })}
                                                className={`px-4 py-2 rounded ${task.status === 'in-progress' ? 'bg-yellow-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                                            >
                                                In Progress
                                            </button>
                                            <button
                                                onClick={() => handleUpdate(task._id, { status: 'done' })}
                                                className={`px-4 py-2 rounded ${task.status === 'done' ? 'bg-green-500 text-white' : 'bg-gray-200 text-gray-800'}`}
                                            >
                                                Done
                                            </button>
                                            <button
                                                onClick={() => handleEdit(task)}
                                                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            >
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(task._id)}
                                                className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </>
                                )}
                            </li>
                        ))}
                    </ul>
                )}
            </div>
        </>
    );
};

export default ShowTasks;