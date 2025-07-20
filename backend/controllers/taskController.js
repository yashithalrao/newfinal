const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const task = new Task({ ...req.body, createdBy: req.user.id });
    await task.save();
    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

exports.getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ createdBy: req.user.id });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching tasks' });
  }
};

exports.getAllTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate('createdBy', 'email'); // 👈 populate email
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching all tasks' });
  }
};



// UPDATE Task
exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only allow creator or admin to update
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedTask);
  } catch (err) {
    res.status(500).json({ message: 'Error updating task', error: err.message });
  }
};

// DELETE Task
exports.deleteTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) return res.status(404).json({ message: 'Task not found' });

    // Only allow creator or admin to delete
    if (task.createdBy.toString() !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    await Task.findByIdAndDelete(req.params.id);
    res.json({ message: 'Task deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting task', error: err.message });
  }
};



// GET /api/tasks/summary
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;
    const today = new Date();
    const startOfWeek = new Date(today);
    startOfWeek.setDate(today.getDate() - today.getDay()); // Sunday

    // Get user's tasks
    const tasks = await Task.find({ createdBy: userId });

    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const completedThisWeek = tasks.filter(t =>
      t.status === 'Completed' &&
      new Date(t.updatedAt) >= startOfWeek
    );
    const overdueTasks = tasks.filter(t =>
      t.status !== 'Completed' &&
      new Date(t.end) < today
    );

    res.json({
      pendingCount: pendingTasks.length,
      pendingList: pendingTasks,
      completedThisWeekCount: completedThisWeek.length,
      overdueCount: overdueTasks.length
    });
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    res.status(500).json({ message: 'Error loading dashboard', error: err.message });
  }
};
