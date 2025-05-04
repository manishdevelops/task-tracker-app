import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

const ForgotPassword = () => {
    const [formData, setFormData] = useState({ email: '' }); // Default state for formData
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value, // Dynamically update the email field
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            setLoading(true);

            const res = await fetch(`${apiUrl}/api/users/forgot-password`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ ...formData, frontendUrl: window.location.origin }),
            });

            if (!res.ok) {
                const errorData = await res.json();
                toast.error(errorData.message || 'Failed to send email');
                setLoading(false);
                return;
            }

            toast.success('Email sent. Please check your inbox!');
            setLoading(false);

            setTimeout(() => {
                navigate('/login'); // Redirect to login page after success
            }, 1500);
        } catch (error) {
            setLoading(false);
            toast.error('Something went wrong. Please try again.');
        }
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleSubmit}
                className="bg-white p-6 rounded shadow-md w-full max-w-md"
            >
                <h2 className="text-2xl font-bold mb-4 text-center">Forgot Password</h2>
                <div className="mb-4">
                    <label htmlFor="email" className="block text-gray-700">
                        Enter your registered email
                    </label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 transition disabled:opacity-50"
                >
                    {loading ? 'Sending...' : 'Send Reset Link'}
                </button>
            </form>
        </div>
    );
};

export default ForgotPassword;