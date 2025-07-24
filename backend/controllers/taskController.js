

const Task = require('../models/Task');

exports.createTask = async (req, res) => {
  try {
    const body = req.body;

    const taskData = {
      ...body,
      createdBy: req.user.id,
    };

    if (body.status === 'Completed') {
  const start = new Date(body.start);
  const actualCompletedDate = new Date();
  const daysTaken = Math.ceil((actualCompletedDate - start) / (1000 * 60 * 60 * 24));
  const actualHrs = parseFloat((daysTaken * 8).toFixed(2));

  taskData.actualCompletedDate = actualCompletedDate;
  taskData.daysTaken = daysTaken;
  taskData.actualHrs = actualHrs;
}


    const task = new Task(taskData);
    await task.save();

    res.status(201).json(task);
  } catch (err) {
    res.status(500).json({ message: 'Error creating task', error: err.message });
  }
};

exports.getAssignedTasks = async (req, res) => {
  try {
    const user = req.user;

    const tasks = await Task.find({
      personHandling: user.email // assuming tasks store email as assignee
    });

    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching assigned tasks', error: err.message });
  }
};


exports.getMyTasks = async (req, res) => {
  try {
    // const tasks = await Task.find({ createdBy: req.user.id });
    const tasks = await Task.find({
  $or: [
    { createdBy: req.user.id },
    { personHandling: req.user.email }
  ]
});

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


exports.updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: 'Task not found' });

    if (
      task.createdBy.toString() !== req.user.id &&
      task.personHandling !== req.user.email &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    // const updates = { ...req.body };

        const updates = { ...req.body };

    // ✅ Check if admin is reassigning
    if (
      req.user.role === 'admin' &&
      req.body.personHandling &&
      req.body.personHandling !== task.personHandling
    ) {
      const newAssignee = await User.findOne({ email: req.body.personHandling });
      if (newAssignee) {
        updates.createdBy = newAssignee._id;
      }
    }
    Object.assign(task, updates);
await task.save();

    // Prevent end date from being overwritten unintentionally
    if (!req.body.explicitlyEditingEndDate) {
      delete updates.end;
    }

    // Set actualStartDate if task moves from Pending → Ongoing
    // if (
    //   task.status === 'Pending' &&
    //   updates.status === 'Ongoing' &&
    //   !task.actualStartDate
    // ) {
    //   updates.actualStartDate = new Date();
    // }
    if (updates.status === 'Ongoing' && !task.actualStartDate) {
  updates.actualStartDate = new Date();
}

    Object.assign(task, req.body);

    await task.save();

    // Recalculate only if task is being marked as completed
    if (updates.status === 'Completed') {
      const start = new Date(updates.start || task.start);
      const actualCompletedDate = new Date();
      const actualStart = updates.actualStart; 
      const daysTaken = Math.ceil(
        (actualCompletedDate - actualStart) / (1000 * 60 * 60 * 24)
      );
      const actualHrs = parseFloat((daysTaken * 7.75).toFixed(2));

      updates.actualCompletedDate = actualCompletedDate;
      updates.daysTaken = daysTaken;
      updates.actualHrs = actualHrs;
    }

    const updatedTask = await Task.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

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


// DELETE ALL TASKS — ADMIN ONLY
exports.deleteAllTasks = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Only admin can delete all tasks' });
    }

    await Task.deleteMany({});
    res.json({ message: 'All tasks deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete all tasks', error: err.message });
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
    // const tasks = await Task.find({ createdBy: userId });
    const tasks = await Task.find({
  $or: [
    { createdBy: req.user.id },
    { personHandling: req.user.email }
  ]
});


    const pendingTasks = tasks.filter(t => t.status === 'Pending');
    const completedThisWeek = tasks.filter(t =>
      t.status === 'Completed' &&
      new Date(t.updatedAt) >= startOfWeek
    );
    const overdueTasks = tasks.filter(t =>
      t.status !== 'Completed' && t.status !== 'Halt' &&
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


// 📌 GET /api/tasks/pending-stats
// exports.getPendingTaskStats = async (req, res) => {
//   try {
//     const tasks = await Task.find({ status: { $in: ['pending', 'ongoing'] } });


//     const statsMap = {};

//     tasks.forEach(t => {
//       const person = t.personHandling;
//       if (!statsMap[person]) statsMap[person] = 0;
//       statsMap[person] += t.plannedHrs || 0;
//     });

//     const result = Object.entries(statsMap).map(([person, pendingHrs]) => ({
//       person,
//       pendingHrs,
//       freeTime: 48 - pendingHrs >= 0 ? (48 - pendingHrs) : 0
//     }));

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: 'Error getting pending stats', error: err.message });
//   }
// };

const User = require('../models/User'); // ⬅️ make sure this is at the top if not already

exports.getPendingTaskStats = async (req, res) => {
  try {
    const tasks = await Task.find({ status: { $in: ['Pending', 'Ongoing'] } });
    const users = await User.find({}, 'email'); // Get all users' emails

    const statsMap = {};

    // Sum plannedHrs for each person from tasks
    tasks.forEach(t => {
      const person = t.personHandling;
      if (!statsMap[person]) statsMap[person] = 0;
      statsMap[person] += t.plannedHrs || 0;
    });

    // Ensure every user has a record in the final list
    const result = users.map(u => {
      const pendingHrs = statsMap[u.email] || 0;
      const freeTime = Math.max(48 - pendingHrs, 0);
      return {
        person: u.email,
        pendingHrs,
        freeTime
      };
    });

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: 'Error getting pending stats', error: err.message });
  }
};

// GET /api/tasks/filter?year=2024&startDate=2025-07-01&endDate=2025-07-31
exports.filterTasks = async (req, res) => {
  try {
    const { year, startDate, endDate } = req.query;
    const query = {};

    if (year) {
      const start = new Date(`${year}-01-01`);
      const end = new Date(`${+year + 1}-01-01`);
      query.start = { $gte: start, $lt: end };
    }

    if (startDate && endDate) {
      query.start = { $gte: new Date(startDate), $lte: new Date(endDate) };
    }

    const tasks = await Task.find(query).populate('createdBy', 'email');
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ message: 'Filtering failed', error: err.message });
  }
};
