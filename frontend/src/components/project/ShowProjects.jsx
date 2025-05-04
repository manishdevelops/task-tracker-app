import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';

const apiUrl = import.meta.env.VITE_API_URL;

const ShowProjects = () => {
    const { currentUser } = useSelector(state => state.user);
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProjects = async () => {
            if (!currentUser) return;

            try {
                const response = await fetch(`${apiUrl}/api/projects/get-projects?userId=${currentUser._id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                });

                const result = await response.json();

                if (!response.ok) {
                    toast.error(result.message || 'Failed to fetch projects');
                } else {
                    setProjects(result.data.projects);
                }
            } catch (error) {
                toast.error('Something went wrong. Please try again.');
            } finally {
                setLoading(false);
            }
        };

        fetchProjects();
    }, [currentUser]);

    if (loading) {
        return <div className="text-center mt-10">Loading...</div>;
    }

    return (
        <div className="flex flex-col items-center p-6">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-800">Your Projects</h2>
            {projects.length === 0 ? (
                <p className="text-center text-gray-600">No projects found.</p>
            ) : (
                <div className="flex flex-col gap-6 w-full max-w-3xl">
                    {projects.map(project => (
                        <div
                            key={project._id}
                            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition"
                        >
                            <h3 className="text-xl font-bold text-gray-800">{project.title}</h3>
                            <p className="text-gray-600 mt-2">{project.description}</p>
                            <p className="text-gray-500 mt-4">
                                <strong>Total Tasks:</strong> {project.tasks?.length || 0}
                            </p>
                            <Link
                                to={`/show-tasks/${project._id}`}
                                className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                            >
                                View Tasks
                            </Link>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default ShowProjects;