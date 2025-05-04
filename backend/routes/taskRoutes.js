const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

// Route for creating a task
router.post('/create-task', authController.protect, taskController.createTask);

// Route for getting tasks by project ID
router.get('/get-tasks/:projectId', authController.protect, taskController.getTasksByProject);

// Route for deleting a task by task ID
router.delete('/delete-task/:id', authController.protect, taskController.deleteTask);

// Route for updating a task by task ID
router.patch('/update-task/:id', authController.protect, taskController.updateTask);

module.exports = router;