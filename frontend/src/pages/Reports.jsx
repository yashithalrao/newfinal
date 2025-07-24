import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import '../App.css';
import {
  PieChart, Pie, Cell,
  Tooltip as RechartTooltip, Legend,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';




export default function Report() {
  //mod: 
  const [pendingStats, setPendingStats] = useState([]);
const [viewFreeTime, setViewFreeTime] = useState(false);

const [startDateFilter, setStartDateFilter] = useState('');
const [endDateFilter, setEndDateFilter] = useState('');
const [yearFilter, setYearFilter] = useState('');


const fetchPendingStats = async () => {
  try {
    const res = await axios.get('/tasks/pending-stats');
    setPendingStats(res.data);
  } catch (err) {
    console.error("Pending stats fetch failed:", err);
  }
};

useEffect(() => {
  fetchPendingStats();
}, []);






  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    fetchAllTasks();
  }, []);


  //fetching all tasks 
  const fetchAllTasks = async () => {
    try {
      const res = await axios.get('/tasks/all');
      setTasks(res.data);
    } catch (err) {
      console.error("Report fetch failed:", err);
    }
  };


  const COLORS = ['#3ba4b7ff', '#e4da17ff', '#1ac76eff'];


  // const statusData = [
  //   { name: 'Pending', value: tasks.filter(t => t.status === 'Pending').length },
  //   { name: 'Ongoing', value: tasks.filter(t => t.status === 'Ongoing').length },
  //   { name: 'Completed', value: tasks.filter(t => t.status === 'Completed').length }
  // ];

  const filteredTasks = tasks.filter((t) => {
  const taskStart = new Date(t.start);

  const matchesDateRange = (!startDateFilter || taskStart >= new Date(startDateFilter)) &&
                           (!endDateFilter || taskStart <= new Date(endDateFilter));

  const matchesYear = !yearFilter || taskStart.getFullYear().toString() === yearFilter;

  return matchesDateRange && matchesYear;
});

const statusData = [
  { name: 'Pending', value: filteredTasks.filter(t => t.status === 'Pending').length },
  { name: 'Ongoing', value: filteredTasks.filter(t => t.status === 'Ongoing').length },
  { name: 'Completed', value: filteredTasks.filter(t => t.status === 'Completed').length }
];

const barData = filteredTasks.map(t => ({
  name: `#${t.slNo}`,
  planned: t.plannedHrs,
  actual: t.actualHrs
}));


  // const barData = tasks.map(t => ({
  //   name: `#${t.slNo}`,
  //   planned: t.plannedHrs,
  //   actual: t.actualHrs
  // }));

  return (
    
    <div style={pageStyle}>
      <h2 style={headerStyle}>📋 Admin Report</h2>
      

      {/* <div style={{ marginBottom: '30px' }}>
        <button onClick={exportCSV} style={exportButtonStyle}>
          Export to CSV
        </button>
      </div> */}<div style={{ marginBottom: '1rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
  <div>
    <label>Start Date: </label>
    <input
      type="date"
      value={startDateFilter}
      onChange={(e) => setStartDateFilter(e.target.value)}
    />
  </div>

  <div>
    <label>End Date: </label>
    <input
      type="date"
      value={endDateFilter}
      onChange={(e) => setEndDateFilter(e.target.value)}
    />
  </div>

  <div>
    <label>Year: </label>
    <select
      value={yearFilter}
      onChange={(e) => setYearFilter(e.target.value)}
    >
      <option value="">All</option>
      {Array.from(new Set(tasks.map(t => new Date(t.start).getFullYear())))
        .sort((a, b) => b - a)
        .map(y => <option key={y} value={y}>{y}</option>)}
    </select>
  </div>

  <button
    onClick={() => {
      setStartDateFilter('');
      setEndDateFilter('');
      setYearFilter('');
    }}
    style={{
      background: '#eee',
      border: '1px solid #ccc',
      borderRadius: '5px',
      padding: '5px 10px',
      cursor: 'pointer',
      fontWeight: '500',
      height: '35px',
      marginTop: '20px',
    }}
  >
    Reset Filters
  </button>
</div>

      

      <div style={chartContainerStyle}>
        <div style={cardStyle}>
          <h3 style={cardTitle}>Task Status Distribution</h3>
          <PieChart width={300} height={300}>
            <Pie data={statusData} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}>
              {statusData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <RechartTooltip contentStyle={tooltipStyle} />
            <Legend />
          </PieChart>
        </div>

        <div style={cardStyle}>
          <h3 style={cardTitle}>Planned vs Actual Hours</h3>
          <BarChart width={500} height={300} data={barData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#ccc" />
            <XAxis dataKey="name" stroke="#333" />
            <YAxis stroke="#333" />
            <Tooltip contentStyle={tooltipStyle} />
            <Legend />
            <Bar dataKey="planned" fill="#0529f4ff" />
            <Bar dataKey="actual" fill="#55e0d0ff" />
          </BarChart>
        </div>
      </div>

      {/* this: */}
            <div style={cardStyle}>
  <h3 style={cardTitle}>
    {viewFreeTime ? 'Person vs Free Time' : 'Person vs Pending Hours'}
  </h3>
  <button
    onClick={() => setViewFreeTime(!viewFreeTime)}
    style={{ marginBottom: '10px', padding: '5px 10px' }}
  >
    Toggle View
  </button>

  <BarChart width={500} height={300} data={pendingStats}>
    <CartesianGrid strokeDasharray="3 3" />
    <XAxis dataKey="person" />
    <YAxis />
    <Tooltip />
    <Legend />
    <Bar
      dataKey={viewFreeTime ? 'freeTime' : 'pendingHrs'}
      fill={viewFreeTime ? '#50fa7b' : '#ff6b6b'}
    />
  </BarChart>
</div>





    </div>
  );
}


const pageStyle = {
  backgroundColor: '#f5faff',
  padding: '40px 20px',
  minHeight: '100vh',
  fontFamily: 'Segoe UI, sans-serif',
  color: '#003366',
};

const headerStyle = {
  marginBottom: '30px',
  color: '#004080',
  fontSize: '28px',
  fontWeight: '600',
  textAlign: 'center',
};

const exportButtonStyle = {
  background: '#007bff',
  color: '#fff',
  padding: '10px 20px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontWeight: 'bold',
  boxShadow: '0 4px 10px rgba(0, 123, 255, 0.2)',
  transition: 'background 0.2s',
};

const chartContainerStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '30px',
  justifyContent: 'center',
  alignItems: 'flex-start',
  width: '100%',
};

const cardStyle = {
  background: '#ffffff',
  padding: '24px',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(0,0,0,0.08)',
  width: '100%',
  maxWidth: '600px',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  margin: '0 auto',
};

const cardTitle = {
  marginBottom: '16px',
  color: '#003366',
  fontSize: '20px',
  fontWeight: '600',
};

const tooltipStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #ccc',
  color: '#333',
};

const tableContainerStyle = {
  marginTop: '50px',
  overflowX: 'auto',
};

const tableStyle = {
  width: '100%',
  borderCollapse: 'collapse',
  background: '#fff',
  color: '#333',
  borderRadius: '8px',
  boxShadow: '0 0 8px rgba(0,0,0,0.05)',
};

tableStyle['th'] = tableStyle['td'] = {
  border: '1px solid #ddd',
  padding: '10px',
  textAlign: 'left',
};
<button
  onClick={() => setViewFreeTime(!viewFreeTime)}
  style={{
    marginBottom: '12px',
    padding: '6px 14px',
    borderRadius: '6px',
    background: '#eee',
    border: '1px solid #ccc',
    cursor: 'pointer',
    fontWeight: '500',
    fontSize: '14px',
  }}
>
  Toggle View
</button>
