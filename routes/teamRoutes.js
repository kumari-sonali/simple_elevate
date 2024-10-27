const express = require('express');
const { createTeam, addMember, getTeam } = require('../controllers/teamController');
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();

router.post('/', authMiddleware, createTeam);
router.post('/:teamId/members', authMiddleware, addMember);
router.get('/:teamId', authMiddleware, getTeam);

module.exports = router;
