import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

const CreateTask = ({ onTaskCreated }) => {
    const { id: projectId } = useParams(); // Get project ID from URL
    const { currentUser } = useSelector(state => state.user); // Get current user
    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.title) {
            newErrors.title = 'Task title is required';
        }
        if (!formData.description) {
            newErrors.description = 'Task description is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) {
            try {
                const response = await fetch(`${apiUrl}/api/tasks/create-task`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        project: projectId,
                        user: currentUser?.user?._id,
                    }),
                    credentials: 'include',
                });

                const result = await response.json();

                if (!response.ok) {
                    toast.error(result.message || 'Failed to create task');
                } else {
                    toast.success('Task created successfully!');
                    setFormData({ title: '', description: '' });
                    if (onTaskCreated) onTaskCreated(); // Call the callback to refresh the task list
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
            }
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-blue-100 to-purple-100">
            <form
                className="bg-white p-8 rounded-lg shadow-lg w-full max-w-lg"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create a New Task</h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Task Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        placeholder="Enter task title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Task Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400"
                        rows="4"
                        placeholder="Enter task description"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 transition"
                >
                    Create Task
                </button>
            </form>
        </div>
    );
};

export default CreateTask;
