
import React, { useState, useEffect } from 'react';
import axios from '../api/axios';

const initialTask = {
  slNo: '',
  projectId: '',
  fixtureNumber: '',
  category: '',
  personHandling: '',
  supportedPerson: '',
  priority: '',
  task: '',
  start: '',
  end: '',
  plannedHrs: '',
  actualHrs: '',
  status: '',
  daysTaken: '',
  remarks: ''
};

const editableFields = Object.keys(initialTask);

export default function TaskForm({ onTaskCreated, editTask, onTaskUpdated }) {
  const [task, setTask] = useState(initialTask);

  useEffect(() => {
    if (editTask) {
      const filtered = {};
      editableFields.forEach(field => {
        filtered[field] = editTask[field] || '';
      });
      setTask(filtered);
    } else {
      setTask(initialTask);
    }
  }, [editTask]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...task,
        slNo: Number(task.slNo),
        plannedHrs: Number(task.plannedHrs),
        actualHrs: Number(task.actualHrs),
        daysTaken: task.daysTaken ? Number(task.daysTaken) : undefined,
        start: new Date(task.start),
        end: new Date(task.end),
      };

      if (editTask?._id) {
        const res = await axios.put(`/tasks/${editTask._id}`, payload);
        onTaskUpdated(res.data);
      } else {
        const res = await axios.post('/tasks', payload);
        onTaskCreated(res.data);
      }

      setTask(initialTask); // reset form
    } catch (err) {
      console.error("Error saving task:", err);
    }
  };

  return (
    <div style={card}>
      <h3 style={{ color: '#fff', marginBottom: '20px' }}>
        {editTask ? "✏️ Edit Task" : "➕ Add Task"}
      </h3>

      <form onSubmit={handleSubmit}>
        {editableFields.map((key) => (
          <div key={key} style={{ marginBottom: '12px' }}>
            {key === 'priority' ? (
              <select name={key} value={task[key]} onChange={handleChange} style={select} required>
                <option value="">Select Priority</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High</option>
              </select>
            ) : key === 'status' ? (
              <select name={key} value={task[key]} onChange={handleChange} style={select} required>
                <option value="">Select Status</option>
                <option value="Pending">Pending</option>
                <option value="Ongoing">Ongoing</option>
                <option value="Completed">Completed</option>
              </select>
            ) : key === 'start' || key === 'end' ? (
              <input
                type="date"
                name={key}
                value={task[key].slice(0, 10)}
                onChange={handleChange}
                style={input}
                required
              />
            ) : ['slNo', 'plannedHrs', 'actualHrs', 'daysTaken'].includes(key) ? (
              <input
                type="number"
                name={key}
                value={task[key]}
                onChange={handleChange}
                placeholder={key}
                style={input}
                required={key !== 'daysTaken'}
              />
            ) : (
              <input
                type="text"
                name={key}
                value={task[key]}
                onChange={handleChange}
                placeholder={key}
                style={input}
                required={key !== 'remarks'}
              />
            )}
          </div>
        ))}
        <button type="submit" style={button}>
          {editTask ? "Update Task" : "Add Task"}
        </button>
      </form>
    </div>
  );
}

const card = {
  background: '#1e1e1e',
  color: '#fff',
  padding: '30px',
  borderRadius: '12px',
  maxWidth: '700px',
  margin: '0 auto 30px',
  boxShadow: '0 0 20px rgba(0,0,0,0.4)'
};

const input = {
  width: '100%',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #333',
  backgroundColor: '#2c2c2c',
  color: '#fff'
};

const select = {
  ...input,
  backgroundColor: '#2c2c2c'
};

const button = {
  padding: '12px 20px',
  backgroundColor: '#4CAF50',
  color: '#fff',
  border: 'none',
  borderRadius: '8px',
  marginTop: '15px',
  cursor: 'pointer',
  fontWeight: 'bold'
};
