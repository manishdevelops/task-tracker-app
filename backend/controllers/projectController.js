const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Project = require('../models/projectModel');

exports.createProject = catchAsync(async (req, res, next) => {
    const { title, description, user } = req.body;

    if (!title || !description || !user) {
        return next(new AppError('Please provide all details', 400));
    }

    // Check if the user already has 4 projects
    const userProjectsCount = await Project.countDocuments({ user });
    if (userProjectsCount >= 4) {
        return next(new AppError('A user cannot have more than 4 projects', 400));
    }

    const project = await Project.create({
        title,
        description,
        user,
    });

    res.status(201).json({
        status: "success",
        data: project,
    });
});

exports.getProject = catchAsync(async (req, res, next) => {
    console.log('getProject function called');
    console.log('Project ID:', req.params.id);

    const project = await Project.findById(req.params.id).populate('tasks'); // Use the virtual field

    if (!project) {
        return next(new AppError('No project found with that ID', 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            project
        }
    });
});

exports.getProjects = catchAsync(async (req, res, next) => {
    const userId = req.user.id; // Extract user ID from the request (set by authController.protect)

    const projects = await Project.find({ user: userId }).populate('tasks');

    if (!projects || projects.length === 0) {
        return next(new AppError('No projects found for this user', 404));
    }

    res.status(200).json({
        status: "success",
        data: {
            projects
        }
    });
});