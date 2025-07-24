import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

import { useAuth } from '../context/authContext';


export default function MyTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');

  const [startDateFilter, setStartDateFilter] = useState('');
const [endDateFilter, setEndDateFilter] = useState('');
const [yearFilter, setYearFilter] = useState('');
const { user } = useAuth();



  useEffect(() => {
  if (!user) return; // Wait for user to be loaded

  const fetchTasks = async () => {
    try {
      const res = await axios.get('/tasks/my');
      setTasks(res.data);
    } catch (err) {
      console.error("Failed to fetch tasks:", err);
    }
  };

  fetchTasks();
}, [user]);


  useEffect(() => {
  let filtered = [...tasks];

  if (statusFilter !== 'All') {
    filtered = filtered.filter(task => task.status === statusFilter);
  }

  if (startDateFilter && endDateFilter) {
    const start = new Date(startDateFilter);
    const end = new Date(endDateFilter);
    filtered = filtered.filter(task => {
      const taskStart = new Date(task.start);
      return taskStart >= start && taskStart <= end;
    });
  }

  if (yearFilter) {
    filtered = filtered.filter(task => {
      const year = new Date(task.start).getFullYear().toString();
      return year === yearFilter;
    });
  }

  setFilteredTasks(filtered);
}, [statusFilter, tasks, startDateFilter, endDateFilter, yearFilter]);

  const handleTaskCreated = (newTask) => {
    setTasks(prev => [...prev, newTask]);
  };

  const handleTaskUpdated = (updatedTask) => {
    setTasks(prev =>
      prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
    );
    setEditTask(null);
  };

  const handleDelete = (id) => {
    setTasks(prev => prev.filter(task => task._id !== id));
  };

  

  return (
    <div>
      <h2>My Tasks</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Status Filter: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Halt</option>
        </select>
      </div>

      <div style={{ margin: '10px 0', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
  <div>
    <label>Start Date: </label>
    <input type="date" value={startDateFilter} onChange={(e) => setStartDateFilter(e.target.value)} />
  </div>

  <div>
    <label>End Date: </label>
    <input type="date" value={endDateFilter} onChange={(e) => setEndDateFilter(e.target.value)} />
  </div>

  <div>
    <label>Year: </label>
    <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
      <option value="">All</option>
      {Array.from(new Set(tasks.map(t => new Date(t.start).getFullYear())))
        .sort()
        .map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>
</div>

<button onClick={() => {
  setStatusFilter('All');
  setStartDateFilter('');
  setEndDateFilter('');
  setYearFilter('');
}}>
  Reset Filters
</button>



      {editTask && (
        <TaskForm
          editTask={editTask}
          onTaskUpdated={handleTaskUpdated}
        />
      )}

      <TaskList
        tasks={filteredTasks}
        onDelete={handleDelete}
        onEdit={setEditTask}
        onEditComplete={handleTaskUpdated}
      />
    </div>
  );
}
