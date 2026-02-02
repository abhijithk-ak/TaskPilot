const express = require('express');
const router = express.Router();
const controller = require('../controllers/taskController');

// Task CRUD routes
router.post('/', controller.createTask);
router.get('/', controller.getTasks);
router.get('/:id', controller.getTaskById);
router.put('/:id', controller.updateTask);
router.delete('/:id', controller.deleteTask);

// AI classification route
router.post('/classify', controller.classifyTask);

module.exports = router;