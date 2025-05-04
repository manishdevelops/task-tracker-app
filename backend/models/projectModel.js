const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
}, {
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Define a virtual field for tasks
projectSchema.virtual('tasks', {
    ref: 'Task', // Model name
    foreignField: 'project', // Field in the Task model that references the project
    localField: '_id', // Field in the Project model that matches the foreignField
});

module.exports = mongoose.model('Project', projectSchema);
