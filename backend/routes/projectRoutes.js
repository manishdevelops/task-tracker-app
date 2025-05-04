const express = require('express');
const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');
const router = express.Router();

router.post('/create-project', authController.protect, projectController.createProject);
router.get('/get-project/:id', authController.protect, projectController.getProject);
router.get('/get-projects', authController.protect, projectController.getProjects);

module.exports = router;

