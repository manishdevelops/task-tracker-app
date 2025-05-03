import React from 'react';

const Navigation = () => {
    return (
        <nav className="flex justify-between items-center p-4 bg-gray-800 text-white">
            <div className="text-2xl font-bold">
                <a href="/">TaskTracker</a>
            </div>
            <div className="flex space-x-4">
                <a
                    href="/login"
                    className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800 transition"
                >
                    Login
                </a>
                <a
                    href="/signup"
                    className="px-4 py-2 border border-white rounded hover:bg-white hover:text-gray-800 transition"
                >
                    Sign Up
                </a>
            </div>
        </nav>
    );
};

export default Navigation;
