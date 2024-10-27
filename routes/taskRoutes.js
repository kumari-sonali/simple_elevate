const express = require('express');
const { createTask, getTasks, updateTaskCompletion } = require('../controllers/taskController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTask);
router.get('/', authMiddleware, getTasks);
router.patch('/:taskId/complete', authMiddleware, updateTaskCompletion);

module.exports = router;
