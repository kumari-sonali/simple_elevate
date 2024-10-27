const Task = require('../models/Task');
const mongoose = require('mongoose');
const io = require('../server').io; 
// Create a new task
exports.createTask = async (req, res) => {
  try {
    const { title, description, priority, dueDate, assignedTo, team, dependencies } = req.body;
    const task = new Task({ title, description, priority, dueDate, assignedTo, team, dependencies });
    await task.save();
    io.emit('taskCreated', task);
    res.status(201).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all tasks with filtering and sorting
exports.getTasks = async (req, res) => {
  try {
    const { priority, dueDate, isComplete, assignedTo, team } = req.query;

    // Construct filter conditions
    let filter = {};
    if (priority) filter.priority = priority;
    if (isComplete !== undefined) filter.isComplete = isComplete;
    if (assignedTo) filter.assignedTo = mongoose.Types.ObjectId(assignedTo);
    if (team) filter.team = mongoose.Types.ObjectId(team);

    const tasks = await Task.find(filter)
      .sort({ dueDate: 1 })  // Sort by due date as an example
      .populate('assignedTo', 'username email')
      .populate('team', 'name');
    
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update task completion status
exports.updateTaskCompletion = async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await Task.findById(taskId);

    if (!task) return res.status(404).json({ message: "Task not found" });

    // Check dependencies
    const incompleteDependencies = await Task.find({
      _id: { $in: task.dependencies },
      isComplete: false
    });

    if (incompleteDependencies.length > 0) {
      return res.status(400).json({ message: "All dependencies must be completed before marking this task complete" });
    }

    task.isComplete = !task.isComplete;
    await task.save();
    io.emit('taskUpdated', task);
    res.status(200).json(task);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
