const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const Project = require('../models/projectModel');

exports.createProject = catchAsync(async (req, res) => {
    const { title, description, user } = req.body;
    if (!title || !description || !user) return next(new AppError('Please provide all project details', 400));

    const project = await Project.create({
        title, description, user
    });

    res.status(401).json({
        status: "success",
        data: project
    });
});