const express = require('express');
const router = express.Router();

const taskController = require('../controllers/taskController');
const authController = require('../controllers/authController');

router.post('/create-task', authController.protect, taskController.createTask);

router.get('/get-tasks/:projectId', authController.protect, taskController.getTasksByProject);

router.delete('/delete-task/:id', authController.protect, taskController.deleteTask);

router.patch('/update-task/:id', authController.protect, taskController.updateTask);

module.exports = router;