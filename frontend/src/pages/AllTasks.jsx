import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [filteredTasks, setFilteredTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [statusFilter, setStatusFilter] = useState('All');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [yearFilter, setYearFilter] = useState('');

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get('/tasks/all');
      setTasks(res.data);
    } catch (err) {
      console.error("Error fetching all tasks:", err);
    }
  };

  useEffect(() => {
    fetchAllTasks();
  }, []);

  useEffect(() => {
    let filtered = tasks;

    if (statusFilter !== 'All') {
      filtered = filtered.filter(t => t.status === statusFilter);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      filtered = filtered.filter(t => {
        const taskDate = new Date(t.start);
        return taskDate >= start && taskDate <= end;
      });
    }

    if (yearFilter) {
      filtered = filtered.filter(t => {
        const taskYear = new Date(t.start).getFullYear().toString();
        return taskYear === yearFilter;
      });
    }

    setFilteredTasks(filtered);
  }, [statusFilter, tasks, startDate, endDate, yearFilter]);

  const handleDeleteAll = async () => {
    if (confirm("Are you sure you want to delete ALL tasks?")) {
      try {
        await axios.delete('/tasks');
        setTasks([]);
      } catch (err) {
        console.error("Error deleting all tasks:", err);
      }
    }
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

  const clearFilters = () => {
    setStatusFilter('All');
    setStartDate('');
    setEndDate('');
    setYearFilter('');
  };

  return (
    <div>
      <h2>All Tasks (Admin View)</h2>

      <div style={{ marginBottom: '1rem' }}>
        <label>Status: </label>
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option>All</option>
          <option>Pending</option>
          <option>Ongoing</option>
          <option>Completed</option>
          <option>Halt</option>
        </select>

        <label style={{ marginLeft: '1rem' }}>Start Date: </label>
        <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />

        <label style={{ marginLeft: '1rem' }}>End Date: </label>
        <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

        <label style={{ marginLeft: '1rem' }}>Year: </label>
        {/* <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
          <option value="">All</option>
          <option>2023</option>
          <option>2024</option>
          <option>2025</option>
          
        </select> */}
        <select value={yearFilter} onChange={(e) => setYearFilter(e.target.value)}>
  <option value="">All</option>
  {Array.from(new Set(tasks.map(t => new Date(t.start).getFullYear())))
    .sort((a, b) => b - a)
    .map((year) => (
      <option key={year} value={year}>{year}</option>
  ))}
</select>


        <button onClick={clearFilters} style={{ marginLeft: '1rem' }}>Reset Filters</button>
        <button style={{ marginLeft: '1rem', backgroundColor: 'red', color: 'white' }} onClick={handleDeleteAll}>
          Delete All Tasks
        </button>
      </div>

      {editTask && (
        <TaskForm editTask={editTask} onTaskUpdated={handleTaskUpdated} />
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
