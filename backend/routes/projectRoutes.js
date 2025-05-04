const express = require('express');
const router = express.Router();

const projectController = require('../controllers/projectController');
const authController = require('../controllers/authController');


router.post('/create-project', authController.protect, projectController.createProject);

module.exports = router;

