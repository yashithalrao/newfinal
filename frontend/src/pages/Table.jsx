// import React, { useEffect, useState } from 'react';
// import axios from '../api/axios';

// const Table = () => {
//   const [tasks, setTasks] = useState([]);

//   useEffect(() => {
//     const fetchTasks = async () => {
//       try {
//         const res = await axios.get('/tasks/all');
//         setTasks(res.data);
//       } catch (err) {
//         console.error('Error fetching tasks:', err);
//       }
//     };

//     fetchTasks();
//   }, []);

//   const exportCSV = () => {
//     const headers = [
//       'SL No', 'Project ID', 'Fixture No', 'Category', 'Person Handling', 'Supported Person',
//       'Priority', 'Task', 'Start Date', 'End Date', 'Actual Start Date', 'Actual Completed Date',
//       'Planned Hrs', 'Actual Hrs', 'Days Taken', 'Status', 'Remarks', 'Created By'
//     ];

//     const rows = tasks.map(t => [
//       t.slNo,
//       t.projectId,
//       t.fixtureNumber,
//       t.category,
//       t.personHandling,
//       t.supportedPerson,
//       t.priority,
//       t.task,
//       t.start ? new Date(t.start).toLocaleDateString() : '',
//       t.end ? new Date(t.end).toLocaleDateString() : '',
//       t.actualStartDate ? new Date(t.actualStartDate).toLocaleDateString() : '',
//       t.actualCompletedDate ? new Date(t.actualCompletedDate).toLocaleDateString() : '',
//       t.plannedHrs,
//       t.actualHrs,
//       t.daysTaken,
//       t.status,
//       t.remarks || '',
//       t.createdBy?.email || 'Unknown'
//     ]);

//     const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
//     const blob = new Blob([csvContent], { type: 'text/csv' });
//     const url = URL.createObjectURL(blob);
//     const a = document.createElement('a');
//     a.href = url;
//     a.download = 'full_task_report.csv';
//     a.click();
//   };

// const tableContainerStyle = {
//   height: 'calc(100vh - 100px)', // adjust 100px based on your header/nav height
//   overflow: 'auto',
//   padding: '20px',
//   backgroundColor: '#f9f9f9',
//   borderRadius: '12px',
//   marginTop: '20px',
//   boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
//   display: 'flex',
//   flexDirection: 'column'
// };


//   const exportButtonStyle = {
//     padding: '8px 16px',
//     backgroundColor: '#007bff',
//     color: '#fff',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//     fontSize: '14px',
//   };

//   const cardTitle = {
//     fontSize: '24px',
//     marginBottom: '12px'
//   };

//   const tableStyle = {
//     width: '100%',
//     borderCollapse: 'collapse'
//   };

//   const thTdStyle = {
//     border: '1px solid #ccc',
//     padding: '8px',
//     textAlign: 'left'
//   };

//  return (
//   <div style={tableContainerStyle}>
//     <div style={{ marginBottom: '30px' }}>
//       <button onClick={exportCSV} style={exportButtonStyle}>
//         Export to CSV
//       </button>
//     </div>
//     <h3 style={cardTitle}>Task Table</h3>
    
//     <div style={{ flex: 1, overflow: 'auto' }}>
//       <table style={tableStyle}>
//         <thead>
//           <tr>
//             {[
//               'SL No', 'Project ID', 'Fixture No', 'Category', 'Person Handling', 'Supported Person',
//               'Priority', 'Task', 'Start Date', 'End Date', 'Actual Start', 'Actual Completed',
//               'Planned Hrs', 'Actual Hrs', 'Days Taken', 'Status', 'Remarks', 'Created By'
//             ].map((header, i) => (
//               <th key={i} style={thTdStyle}>{header}</th>
//             ))}
//           </tr>
//         </thead>
//         <tbody>
//           {tasks.map((t, i) => (
//             <tr key={i}>
//               <td style={thTdStyle}>{t.slNo}</td>
//               <td style={thTdStyle}>{t.projectId}</td>
//               <td style={thTdStyle}>{t.fixtureNumber}</td>
//               <td style={thTdStyle}>{t.category}</td>
//               <td style={thTdStyle}>{t.personHandling}</td>
//               <td style={thTdStyle}>{t.supportedPerson}</td>
//               <td style={thTdStyle}>{t.priority}</td>
//               <td style={thTdStyle}>{t.task}</td>
//               <td style={thTdStyle}>{t.start ? new Date(t.start).toLocaleDateString() : ''}</td>
//               <td style={thTdStyle}>{t.end ? new Date(t.end).toLocaleDateString() : ''}</td>
//               <td style={thTdStyle}>{t.actualStartDate ? new Date(t.actualStartDate).toLocaleDateString() : ''}</td>
//               <td style={thTdStyle}>{t.actualCompletedDate ? new Date(t.actualCompletedDate).toLocaleDateString() : ''}</td>
//               <td style={thTdStyle}>{t.plannedHrs}</td>
//               <td style={thTdStyle}>{t.actualHrs}</td>
//               <td style={thTdStyle}>{t.daysTaken}</td>
//               <td style={thTdStyle}>{t.status}</td>
//               <td style={thTdStyle}>{t.remarks || ''}</td>
//               <td style={thTdStyle}>{t.createdBy?.email || 'Unknown'}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   </div>
// );

// };

// export default Table;


import React, { useEffect, useState } from 'react';
import axios from '../api/axios';

const Table = () => {
  const [tasks, setTasks] = useState([]);
  const [filters, setFilters] = useState({
    employee: '',
    status: '',
    projectId: ''
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const res = await axios.get('/tasks/all');
        setTasks(res.data);
      } catch (err) {
        console.error('Error fetching tasks:', err);
      }
    };

    fetchTasks();
  }, []);

  const exportCSV = () => {
    const headers = [
      'SL No', 'Project ID', 'Fixture No', 'Category', 'Person Handling', 'Supported Person',
      'Priority', 'Task', 'Start Date', 'End Date', 'Actual Start Date', 'Actual Completed Date',
      'Planned Hrs', 'Actual Hrs', 'Days Taken', 'Status', 'Remarks', 'Created By'
    ];

    const rows = filteredTasks.map(t => [
      t.slNo,
      t.projectId,
      t.fixtureNumber,
      t.category,
      t.personHandling,
      t.supportedPerson,
      t.priority,
      t.task,
      t.start ? new Date(t.start).toLocaleDateString() : '',
      t.end ? new Date(t.end).toLocaleDateString() : '',
      t.actualStartDate ? new Date(t.actualStartDate).toLocaleDateString() : '',
      t.actualCompletedDate ? new Date(t.actualCompletedDate).toLocaleDateString() : '',
      t.plannedHrs,
      t.actualHrs,
      t.daysTaken,
      t.status,
      t.remarks || '',
      t.createdBy?.email || 'Unknown'
    ]);

    const csvContent = [headers, ...rows].map(e => e.join(',')).join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'full_task_report.csv';
    a.click();
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const filteredTasks = tasks.filter(task => {
    return (
      (filters.employee === '' || task.createdBy?.email === filters.employee) &&
      (filters.status === '' || task.status === filters.status) &&
      (filters.projectId === '' || task.projectId === filters.projectId)
    );
  });

  const tableContainerStyle = {
    height: 'calc(100vh - 100px)',
    overflow: 'auto',
    padding: '20px',
    backgroundColor: '#f9f9f9',
    borderRadius: '12px',
    marginTop: '20px',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    display: 'flex',
    flexDirection: 'column'
  };

  const exportButtonStyle = {
    padding: '8px 16px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
    fontSize: '14px',
    marginRight: '12px'
  };

  const selectStyle = {
    padding: '6px 12px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    fontSize: '14px',
    marginRight: '12px'
  };

  const cardTitle = {
    fontSize: '24px',
    marginBottom: '12px'
  };

  const tableStyle = {
    width: '100%',
    borderCollapse: 'collapse'
  };

  const thTdStyle = {
    border: '1px solid #ccc',
    padding: '8px',
    textAlign: 'left'
  };

  const uniqueEmployees = [...new Set(tasks.map(t => t.createdBy?.email).filter(Boolean))];
  const uniqueStatuses = [...new Set(tasks.map(t => t.status).filter(Boolean))];
  const uniqueProjectIds = [...new Set(tasks.map(t => t.projectId).filter(Boolean))];

  return (
    <div style={tableContainerStyle}>
      <div style={{ marginBottom: '30px', display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={exportCSV} style={exportButtonStyle}>
          Export to CSV
        </button>

        <select name="employee" value={filters.employee} onChange={handleFilterChange} style={selectStyle}>
          <option value="">All Employees</option>
          {uniqueEmployees.map((emp, i) => (
            <option key={i} value={emp}>{emp}</option>
          ))}
        </select>

        <select name="status" value={filters.status} onChange={handleFilterChange} style={selectStyle}>
          <option value="">All Statuses</option>
          {uniqueStatuses.map((stat, i) => (
            <option key={i} value={stat}>{stat}</option>
          ))}
        </select>

        <select name="projectId" value={filters.projectId} onChange={handleFilterChange} style={selectStyle}>
          <option value="">All Projects</option>
          {uniqueProjectIds.map((pid, i) => (
            <option key={i} value={pid}>{pid}</option>
          ))}
        </select>
      </div>

      <h3 style={cardTitle}>Task Table</h3>

      <div style={{ flex: 1, overflow: 'auto' }}>
        <table style={tableStyle}>
          <thead>
            <tr>
              {[
                'SL No', 'Project ID', 'Fixture No', 'Category', 'Person Handling', 'Supported Person',
                'Priority', 'Task', 'Start Date', 'End Date', 'Actual Start', 'Actual Completed',
                'Planned Hrs', 'Actual Hrs', 'Days Taken', 'Status', 'Remarks', 'Created By'
              ].map((header, i) => (
                <th key={i} style={thTdStyle}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredTasks.map((t, i) => (
              <tr key={i}>
                <td style={thTdStyle}>{t.slNo}</td>
                <td style={thTdStyle}>{t.projectId}</td>
                <td style={thTdStyle}>{t.fixtureNumber}</td>
                <td style={thTdStyle}>{t.category}</td>
                <td style={thTdStyle}>{t.personHandling}</td>
                <td style={thTdStyle}>{t.supportedPerson}</td>
                <td style={thTdStyle}>{t.priority}</td>
                <td style={thTdStyle}>{t.task}</td>
                <td style={thTdStyle}>{t.start ? new Date(t.start).toLocaleDateString() : ''}</td>
                <td style={thTdStyle}>{t.end ? new Date(t.end).toLocaleDateString() : ''}</td>
                <td style={thTdStyle}>{t.actualStartDate ? new Date(t.actualStartDate).toLocaleDateString() : ''}</td>
                <td style={thTdStyle}>{t.actualCompletedDate ? new Date(t.actualCompletedDate).toLocaleDateString() : ''}</td>
                <td style={thTdStyle}>{t.plannedHrs}</td>
                <td style={thTdStyle}>{t.actualHrs}</td>
                <td style={thTdStyle}>{t.daysTaken}</td>
                <td style={thTdStyle}>{t.status}</td>
                <td style={thTdStyle}>{t.remarks || ''}</td>
                <td style={thTdStyle}>{t.createdBy?.email || 'Unknown'}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Table;
