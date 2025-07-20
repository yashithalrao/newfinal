import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import '../App.css'
import {
  PieChart, Pie, Cell,
  Tooltip as RechartTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

export default function Report() {
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    try {
      const res = await axios.get('/tasks/all');
      setTasks(res.data);
    } catch (err) {
      console.error("Report fetch failed:", err);
    }
  };

  const exportCSV = () => {
    const headers = [
      'SL No', 'Project ID', 'Fixture No', 'Person Email',
      'Start Date', 'End Date', 'Planned Hrs', 'Actual Hrs',
      'Variance', 'Status'
    ];
    const rows = tasks.map(t => [
      t.slNo, t.projectId, t.fixtureNumber,
      t.createdBy?.email || 'Unknown',
      new Date(t.start).toLocaleDateString(),
      new Date(t.end).toLocaleDateString(),
      t.plannedHrs,
      t.actualHrs,
      (t.actualHrs - t.plannedHrs).toFixed(2),
      t.status
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'task_report.csv';
    a.click();
  };

  const COLORS = ['#ff6b6b', '#ffe66d', '#06d6a0'];

  const statusData = [
    { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
    { name: 'Ongoing', value: tasks.filter(t => t.status === 'Ongoing').length },
    { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length }
  ];

  const barData = tasks.map(t => ({
    name: `#${t.slNo}`,
    planned: t.plannedHrs,
    actual: t.actualHrs
  }));

  return (
    <div style={{
      backgroundColor: '#121212',
      padding: '40px',
      minHeight: '100vh',
      fontFamily: 'Segoe UI',
      color: '#e0e0e0'
    }}>
      <h2 style={{ marginBottom: '20px', color: '#ffffff' }}>📋 Admin Report</h2>

      <div style={{ marginBottom: '30px' }}>
        <button
          onClick={exportCSV}
          style={{
            background: '#00ff88',
            color: '#000',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
            boxShadow: '0 0 10px #00ff8870'
          }}
        >
          Export to CSV
        </button>
      </div>

      <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap', justifyContent: 'center' }}>
        <div style={cardStyle}>
          <h3 style={cardTitle}>Task Status Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartTooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} />
            <Legend />
          </PieChart>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Planned vs Actual Hours</h3>
          <BarChart width={500} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#444" />
            <XAxis dataKey="name" stroke="#ccc" />
            <YAxis stroke="#ccc" />
            <Tooltip contentStyle={{ backgroundColor: '#333', border: 'none', color: '#fff' }} />
            <Legend />
            <Bar dataKey="planned" fill="#00bcd4" />
            <Bar dataKey="actual" fill="#d81b60" />
          </BarChart>
        </div>
      </div>

      <div style={{ marginTop: '50px', overflowX: 'auto' }}>
        <h3 style={cardTitle}>Task Table</h3>
        <table style={tableStyle}>
          <thead>
            <tr>
              {['SL No', 'Project ID', 'Fixture No', 'Person Email', 'Start Date', 'End Date', 'Planned Hrs', 'Actual Hrs', 'Variance', 'Status'].map((header, i) => (
                <th key={i}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {tasks.map((t, i) => (
              <tr key={i}>
                <td>{t.slNo}</td>
                <td>{t.projectId}</td>
                <td>{t.fixtureNumber}</td>
                <td>{t.createdBy?.email || 'Unknown'}</td>
                <td>{new Date(t.start).toLocaleDateString()}</td>
                <td>{new Date(t.end).toLocaleDateString()}</td>
                <td>{t.plannedHrs}</td>
                <td>{t.actualHrs}</td>
                <td>{(t.actualHrs - t.plannedHrs).toFixed(2)}</td>
                <td>{t.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

const cardStyle = {
  background: '#1e1e1e',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 0 12px rgba(0,255,136,0.05)',
  flex: '1 1 40%',
  maxWidth: '600px'
};

const cardTitle = {
  marginBottom: '16px',
  color: '#e0e0e0'
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#1a1a1a',
  color: '#e0e0e0',
  borderRadius: '8px',
  overflow: 'hidden',
  boxShadow: '0 0 8px rgba(0,255,136,0.05)'
};
