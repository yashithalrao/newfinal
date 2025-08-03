/*

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
};*/



const Task = require('../models/Task');

const calculatePlannedHours = (start, end, hoursPerDay = 0) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const sameDay = startDate.toDateString() === endDate.toDateString();

  if (sameDay) {
    const diffMs = endDate - startDate;
    const diffHrs = diffMs / (1000 * 60 * 60);
    return parseFloat(diffHrs.toFixed(2));
  } else {
    // ⛳ NEW: Strip time, only keep the date part
    const startDay = new Date(startDate.getFullYear(), startDate.getMonth(), startDate.getDate());
    const endDay = new Date(endDate.getFullYear(), endDate.getMonth(), endDate.getDate());

    const dayDiff = Math.ceil((endDay - startDay) / (1000 * 60 * 60 * 24)) + 1;

    return parseFloat((dayDiff * hoursPerDay).toFixed(2));
  }
};


exports.createTask = async (req, res) => {
  try {
    const body = req.body;

const { start, end, hoursPerDay = 0 } = body;

const plannedHrs = calculatePlannedHours(start, end, hoursPerDay);
//taskData.hoursPerDay = hoursPerDay;


const taskData = {
  ...body,
  createdBy: req.user.id,
  plannedHrs, 
  hoursPerDay
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


        const updates = { ...req.body };
        const { start, end, hoursPerDay = 0 } = updates;

// if (start && end) {
//   updates.plannedHrs = calculatePlannedHours(start, end, hoursPerDay);
// }
// Always update hoursPerDay if it's sent
if (updates.hoursPerDay !== undefined) {
  task.hoursPerDay = updates.hoursPerDay;
}

// Recalculate if dates or hoursPerDay changed
if ((start && end) || updates.hoursPerDay !== undefined) {
  const startDate = start || task.start;
  const endDate = end || task.end;
  const dailyHrs = updates.hoursPerDay !== undefined ? updates.hoursPerDay : task.hoursPerDay;
  updates.plannedHrs = calculatePlannedHours(startDate, endDate, dailyHrs);
}



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

    // Recalculate only if task is being marked as completed
    if (updates.status === 'Completed') {


      const actualStartDate = task.actualStartDate || new Date(); // fallback
const actualCompletedDate = new Date();
const sameDay = actualStartDate.toDateString() === actualCompletedDate.toDateString();

let actualHrs = 0;
let daysTaken = 0;

if (sameDay) {
  const diffMs = actualCompletedDate - actualStartDate;
  actualHrs = parseFloat((diffMs / (1000 * 60 * 60)).toFixed(2));
  daysTaken = 1;
} else {
  const hoursPerDay = updates.hoursPerDay || task.hoursPerDay || 0;
  daysTaken = Math.ceil((actualCompletedDate - actualStartDate) / (1000 * 60 * 60 * 24)) + 1;
  actualHrs = parseFloat((daysTaken * hoursPerDay).toFixed(2));
}

updates.actualStartDate = actualStartDate;
updates.actualCompletedDate = actualCompletedDate;
updates.actualHrs = actualHrs;
updates.daysTaken = daysTaken;



      updates.actualCompletedDate = actualCompletedDate;
      updates.daysTaken = daysTaken;
      updates.actualHrs = actualHrs;
    }
    Object.assign(task, updates);
await task.save();

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



const User = require('../models/User'); // ⬅️ make sure this is at the top if not already

// exports.getPendingTaskStats = async (req, res) => {
//   try {
//     const tasks = await Task.find({ status: { $in: ['Pending', 'Ongoing'] } });
//     const users = await User.find({}, 'email'); // Get all users' emails

//     const statsMap = {};

//     // Sum plannedHrs for each person from tasks
//     tasks.forEach(t => {
//       const person = t.personHandling;
//       if (!statsMap[person]) statsMap[person] = 0;
//       statsMap[person] += t.plannedHrs || 0;
//     });

//     // Ensure every user has a record in the final list
//     const result = users.map(u => {
//       const pendingHrs = statsMap[u.email] || 0;
//       const freeTime = Math.max(48 - pendingHrs, 0);
//       return {
//         person: u.email,
//         pendingHrs,
//         freeTime
//       };
//     });

//     res.json(result);
//   } catch (err) {
//     res.status(500).json({ message: 'Error getting pending stats', error: err.message });
//   }
// };

exports.getPendingTaskStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const today = new Date();

    const totalDays = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
    const totalHrs = totalDays * 8;

    const tasks = await Task.find({ status: { $in: ['Pending', 'Ongoing'] } });
    const users = await User.find({}, 'email');

    const statsMap = {};

    

const personDayMap = {}; // key: person -> date string -> hours

tasks.forEach(t => {
  const person = t.personHandling;
  if (!person) return;

  const taskStart = new Date(t.start);
  const taskEnd = new Date(t.end);
  const hrsPerDay = t.hoursPerDay || 2;

  if (taskEnd < start) return;

  let effectiveStart;

  if (t.status === "Pending") {
    if (today < taskStart) {
      effectiveStart = taskStart > end ? end : taskStart;
    } else {
      effectiveStart = today > end ? end : (today > start ? today : start);
    }
  } else {
    effectiveStart = [taskStart, start, today].sort((a, b) => b - a)[0];
  }

  const effectiveEnd = taskEnd < end ? taskEnd : end;

  const current = new Date(effectiveStart);

  while (current <= effectiveEnd) {
    const dateStr = current.toISOString().split('T')[0];

    if (!personDayMap[person]) personDayMap[person] = {};
    if (!personDayMap[person][dateStr]) personDayMap[person][dateStr] = 0;

    personDayMap[person][dateStr] += hrsPerDay;

    current.setDate(current.getDate() + 1);
  }
});

Object.entries(personDayMap).forEach(([person, dayMap]) => {
  statsMap[person] = Object.values(dayMap).reduce((a, b) => a + b, 0);
});


    const result = users.map(u => {
      const pendingHrs = statsMap[u.email] || 0;
      const freeTime = Math.max(totalHrs - pendingHrs, 0);
      return {
        person: u.email,
        pendingHrs: Number(pendingHrs.toFixed(2)),
        freeTime: Number(freeTime.toFixed(2)),
        totalHrs: totalHrs
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error in /pending-stats:", err);
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

