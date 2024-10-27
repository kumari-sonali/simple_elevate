const Team = require('../models/Team');
const User = require('../models/User');
const mongoose = require('mongoose');

// Create a new team
exports.createTeam = async (req, res) => {
  try {
    const { name, ownerId } = req.body;
    const team = new Team({ name, members: [{ user: ownerId, role: 'Owner' }] });
    await team.save();
    res.status(201).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a member to a team
exports.addMember = async (req, res) => {
  try {
    const { teamId, userId, role } = req.body;

    const team = await Team.findById(teamId);
    if (!team) return res.status(404).json({ message: "Team not found" });

    const isMember = team.members.find(member => member.user.toString() === userId);
    if (isMember) return res.status(400).json({ message: "User already a team member" });

    team.members.push({ user: userId, role });
    await team.save();

    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get team details with members
exports.getTeam = async (req, res) => {
  try {
    const { teamId } = req.params;
    const team = await Team.findById(teamId).populate('members.user', 'username email');

    if (!team) return res.status(404).json({ message: "Team not found" });
    res.status(200).json(team);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
