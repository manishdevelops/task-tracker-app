import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { signInSuccess } from '../../redux/user/userSlice';

const apiUrl = import.meta.env.VITE_API_URL;

const ResetPassword = () => {
    const dispatch = useDispatch();
    const { token } = useParams();
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        password: '',
        passwordConfirm: '',
    });
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.id]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.password || !formData.passwordConfirm) {
            return toast.error('Both fields are required.');
        }

        if (formData.password !== formData.passwordConfirm) {
            return toast.error('Passwords do not match.');
        }

        try {
            setLoading(true);

            const res = await fetch(`${apiUrl}/api/users/reset-password/${token}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(formData),
            });

            if (!res.ok) {
                const errorData = await res.json();
                setLoading(false);
                return toast.error(errorData.message || 'Failed to reset password.');
            }

            const data = await res.json();

            toast.success('Password reset successful.');
            dispatch(signInSuccess(data.data));

            setTimeout(() => {
                navigate('/'); // Redirect to home page
                toast.success('You are now logged in.');
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
                <h2 className="text-2xl font-bold mb-4 text-center">Reset Your Password</h2>
                <div className="mb-4">
                    <label htmlFor="password" className="block text-gray-700">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Enter new password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label htmlFor="passwordConfirm" className="block text-gray-700">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="passwordConfirm"
                        value={formData.passwordConfirm}
                        onChange={handleChange}
                        placeholder="Confirm new password"
                        className="w-full px-4 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-green-700 text-white py-2 px-4 rounded hover:bg-green-800 transition disabled:opacity-50"
                >
                    {loading ? 'Resetting...' : 'Reset Password'}
                </button>
            </form>
        </div>
    );
};

export default ResetPassword;