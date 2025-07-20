
const express = require('express');
const router = express.Router();
const taskController = require('../controllers/taskController');
const { authenticate, authorizeRoles } = require('../middleware/authMiddleware');

// CREATE
router.post('/', authenticate, taskController.createTask);

// READ (My tasks)
router.get('/my', authenticate, taskController.getMyTasks);

// READ (All tasks — Admin only)
router.get('/all', authenticate, authorizeRoles('admin'), taskController.getAllTasks);

// UPDATE
router.put('/:id', authenticate, taskController.updateTask);

// DELETE
router.delete('/:id', authenticate, taskController.deleteTask);

router.get('/summary', authenticate, taskController.getDashboardStats);

module.exports = router;

