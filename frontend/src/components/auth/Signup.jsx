import React, { useState } from 'react';
const apiUrl = import.meta.env.VITE_API_URL;
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice'

const Signup = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        name: '',
        country: '',
    });

    const [confirmPassword, setConfirmPassword] = useState('');
    const [errors, setErrors] = useState({});

    const validate = () => {
        const newErrors = {};
        if (!formData.email) {
            newErrors.email = 'Email is required';
        } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email is invalid';
        }
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters';
        }
        if (!confirmPassword) {
            newErrors.confirmPassword = 'Confirm Password is required';
        } else if (formData.password !== confirmPassword) {
            newErrors.confirmPassword = 'Passwords do not match';
        }
        if (!formData.name) {
            newErrors.name = 'Name is required';
        }
        if (!formData.country) {
            newErrors.country = 'Country is required';
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleConfirmPasswordChange = (e) => {
        setConfirmPassword(e.target.value);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (validate()) {
            console.log('Form submitted:', formData);
            getUserData();

        }
    };

    const getUserData = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/users/signup`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            const result = await response.json();

            if (!response.ok) {
                // Handle API error (e.g., duplicate email, validation error)
                console.error(result.message || 'Signup failed');
                toast.error(result.message || 'Signup failed');
            } else {
                // Success
                console.log('User signed up:', result.data);
                dispatch(signInSuccess(result.data));
                toast.success('Signup successful!');
                navigate('/');
            }
        } catch (error) {
            console.error('Network error:', error);
            toast.error('Something went wrong. Please try again.');
        }
    }

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                className="bg-white p-6 rounded shadow-md w-full max-w-md"
                onSubmit={handleSubmit}
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Sign Up</h2>
                <div className="mb-4">
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Password</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Confirm Password</label>
                    <input
                        type="password"
                        value={confirmPassword}
                        onChange={handleConfirmPasswordChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700">Country</label>
                    <input
                        type="text"
                        name="country"
                        value={formData.country}
                        onChange={handleChange}
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    {errors.country && <p className="text-red-500 text-sm">{errors.country}</p>}
                </div>
                <button
                    type="submit"
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition"
                >
                    Sign Up
                </button>
            </form>
        </div>
    );
};

export default Signup;
