import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';


const CreateProject = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);

    const [formData, setFormData] = useState({
        title: '',
        description: '',
    });

    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.title) {
            newErrors.title = 'Project title is required';
        }
        if (!formData.description) {
            newErrors.description = 'Description is required';
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
                const response = await fetch(`${apiUrl}/api/projects/create-project`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        ...formData,
                        user: currentUser?.user?._id,
                    }),
                    credentials: 'include',
                });

                const result = await response.json();

                if (!response.ok) {
                    toast.error(result.message || 'Failed to create project');
                } else {
                    toast.success('Project created successfully!');
                    setFormData({ title: '', description: '' });
                    navigate('/show-projects');
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
            }
        }
    };



    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-r from-green-100 to-blue-100">
            <form
                className="bg-white p-8 rounded-xl shadow-lg w-full max-w-lg"
                onSubmit={handleSubmit}
            >
                <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Create a New Project</h2>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Project Title</label>
                    <input
                        type="text"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        placeholder="Enter your project title"
                    />
                    {errors.title && <p className="text-red-500 text-sm mt-1">{errors.title}</p>}
                </div>
                <div className="mb-6">
                    <label className="block text-gray-700 font-medium mb-2">Description</label>
                    <textarea
                        name="description"
                        value={formData.description}
                        onChange={handleChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-400"
                        rows="4"
                        placeholder="Describe your project"
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-green-400 text-white py-3 px-4 rounded-lg hover:bg-green-500 transition"
                >
                    Create Project
                </button>
            </form>
        </div>
    );
};

export default CreateProject;