import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { logOutUserSuccess } from '../../redux/user/userSlice';
const apiUrl = import.meta.env.VITE_API_URL;
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';



const Navigation = () => {
    const navigate = useNavigate();
    const { currentUser } = useSelector(state => state.user);
    const dispatch = useDispatch();

    const handleLogout = async () => {
        try {
            const response = await fetch(`${apiUrl}/api/users/logout`, {
                method: 'GET',
                credentials: 'include', // Important to include cookies
            });

            const result = await response.json();

            if (response.ok) {
                dispatch(logOutUserSuccess());
                toast.success('User logged out');
                navigate('/');

            } else {
                toast.error('Logout error:', result.message);
            }
        } catch (error) {
            toast.error('Logout failed:', error);
        }
    };

    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-2xl font-bold">
                <Link to="/">TaskTracker</Link>
            </div>
            <div className="flex space-x-4">
                {currentUser ? (
                    <>
                        <span className="px-4 py-2">Hello, {currentUser.user.name}</span>
                        <Link
                            to="/show-projects"
                            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800 transition"
                        >
                            View Your Projects
                        </Link>
                        <button
                            onClick={handleLogout}
                            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800 transition"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <Link
                            to="/login"
                            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800 transition"
                        >
                            Login
                        </Link>
                        <Link
                            to="/signup"
                            className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800 transition"
                        >
                            Sign Up
                        </Link>
                    </>
                )}
            </div>
        </nav>
    );
};

export default Navigation;
