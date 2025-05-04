const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Project = require('../models/projectModel');
const Task = require('../models/taskModel');
const mongoose = require('mongoose');

exports.createTask = catchAsync(async (req, res, next) => {
    const { title, description, status, user, project } = req.body;

    if (!title || !description || !status, !user, !project) {
        return next(new AppError('Please provide all details', 400));
    }

    // Check if the user already has 4 projects
    const userProjectsCount = await Project.countDocuments({ user });
    if (userProjectsCount >= 4) {
        return next(new AppError('A user cannot have more than 4 projects', 400));
    }

    const newProject = await Task.create({
        title,
        description,
        status,
        user,
        project
    });

    res.status(201).json({
        status: "success",
        data: newProject,
    });
});

exports.getTasksByProject = catchAsync(async (req, res, next) => {
    const { projectId } = req.params;

    const tasks = await Task.find({ project: projectId });

    if (!tasks || tasks.length === 0) {
        return next(new AppError('No tasks found for this project', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            tasks,
        },
    });
});

exports.deleteTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
        return next(new AppError('Invalid task ID', 400));
    }

    const task = await Task.findById(id);

    if (!task) {
        return next(new AppError('No task found with that ID', 404));
    }

    await task.remove();

    res.status(200).json({
        status: 'success',
        message: 'Task deleted successfully',
    });
});

exports.updateTask = catchAsync(async (req, res, next) => {
    const { id } = req.params;
    const { title, description, status } = req.body;

    const updatedTask = await Task.findByIdAndUpdate(
        id,
        { title, description, status },
        { new: true, runValidators: true }
    );

    if (!updatedTask) {
        return next(new AppError('No task found with that ID', 404));
    }

    res.status(200).json({
        status: 'success',
        data: {
            task: updatedTask,
        },
    });
});

