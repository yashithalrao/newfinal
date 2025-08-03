/*import React from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/authContext'; 

export default function TaskList({ tasks, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  const { user } = useAuth();

  return (
    <div style={containerStyle}>
      {tasks.map((t) => (
        <div key={t._id} style={{  ...cardStyle,
  ...(t.status === 'Halt' && haltedCardStyle)}}>
          <div style={grid}>
            <span><b>Sl. No:</b> {t.slNo}</span>
            <span><b>Project ID:</b> {t.projectId}</span>
            <span><b>Fixture No.:</b> {t.fixtureNumber}</span>
            <span><b>Category:</b> {t.category}</span>
            <span><b>Person Handling:</b> {t.personHandling}</span>
            <span><b>Supported Person:</b> {t.supportedPerson}</span>
            <span><b>Priority:</b> {t.priority}</span>
            <span><b>Task:</b> {t.task}</span>
            <span><b>Start:</b> {new Date(t.start).toLocaleDateString()}</span>
            <span><b>End:</b> {new Date(t.end).toLocaleDateString()}</span>
            <span><b>Planned Hours:</b> {t.plannedHrs}</span>
            <span><b>Status:</b> {t.status}</span>
            <span><b>Remarks:</b> {t.remarks}</span>

{t.status === 'Completed' && (
  <>
    <span><b>📅 Actual Completed Date:</b> {new Date(t.actualCompletedDate).toLocaleDateString()}</span>
    <span><b>🕒 Actual Hours:</b> {t.actualHrs}</span>
    <span><b>📆 Days Taken:</b> {t.daysTaken}</span>
  </>
)}

{t.actualStartDate && (
  <span><b>Actual Start:</b> {new Date(t.actualStartDate).toLocaleDateString()}</span>
)}

          </div>

          <div style={buttonRow}>
            <button style={editButton} onClick={() => onEdit(t)}>Edit</button>
            {user?.role === 'admin' && (
              <button style={deleteButton} onClick={() => handleDelete(t._id)}>Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Styles ---


// --- Styles ---
const containerStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: '#f0f6ff', // light blue background
  minHeight: '100vh'
};

const cardStyle = {
  background: '#ffffff',
  color: '#0a1d37',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 123, 255, 0.1)'
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
  marginBottom: '20px'
};

const buttonRow = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const editButton = {
  backgroundColor: '#007bff',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  boxShadow: '0 0 6px rgba(0, 123, 255, 0.2)'
};

const deleteButton = {
  backgroundColor: '#dc3545',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  boxShadow: '0 0 6px rgba(220, 53, 69, 0.2)'
};

const haltedCardStyle = {
  backgroundColor: '#f0f0f0',
  color: '#777',
  border: '1px solid #ccc',
  opacity: 0.8
};
*/
import React from 'react';
import axios from '../api/axios';
import { useAuth } from '../context/authContext'; 

export default function TaskList({ tasks, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };
function formatDateTimeDisplay(dateStr) {
  const d = new Date(dateStr);

  // If time is 00:00 (default), manually set to 08:00
  if (d.getHours() === 0 && d.getMinutes() === 0) {
    d.setHours(8);
    d.setMinutes(0);
  }

  const pad = (n) => String(n).padStart(2, '0');
  const dd = pad(d.getDate());
  const MM = pad(d.getMonth() + 1);
  const yyyy = d.getFullYear();
  const hh = pad(d.getHours());
  const mm = pad(d.getMinutes());

  return `${dd}-${MM}-${yyyy} ${hh}:${mm}`;
}

  
  const { user } = useAuth();

  return (
    <div style={containerStyle}>
      {tasks.map((t) => (
        <div key={t._id} style={{  ...cardStyle,
  ...(t.status === 'Halt' && haltedCardStyle)}}>
          <div style={grid}>
            <span><b>Sl. No:</b> {t.slNo}</span>
            <span><b>Project ID:</b> {t.projectId}</span>
            <span><b>Fixture No.:</b> {t.fixtureNumber}</span>
            <span><b>Category:</b> {t.category}</span>
            <span><b>Person Handling:</b> {t.personHandling}</span>
            <span><b>Supported Person:</b> {t.supportedPerson}</span>
            <span><b>Priority:</b> {t.priority}</span>
            <span><b>Task:</b> {t.task}</span>
<span><b>Start:</b> {formatDateTimeDisplay(t.start)}</span>
<span><b>End:</b> {formatDateTimeDisplay(t.end)}</span>

            <span><b>Planned Hours:</b> {t.plannedHrs}</span>
            {t.hoursPerDay !== 0 && t.hoursPerDay != null && (
  <span><b>Hours Per Day:</b> {t.hoursPerDay}</span>
)}

<span>
  <b>Status:</b>{" "}
  {t.status === "Ongoing"
    ? "Work in Progress"
    : t.status === "Halt"
    ? "Hold"
    : t.status}
</span>
            <span><b>Remarks:</b> {t.remarks}</span>

{t.status === 'Completed' && (
  <>
    <span><b>Actual Completed Date:</b> {formatDateTimeDisplay(t.actualCompletedDate)}</span>
    <span><b>Actual Hours:</b> {t.actualHrs}</span>
    <span><b>Days Taken:</b> {t.daysTaken}</span>
  </>
)}

{t.actualStartDate && (
  <span><b>Actual Start:</b> {formatDateTimeDisplay(t.actualStartDate)}</span>
)}

          </div>

          <div style={buttonRow}>
            <button style={editButton} onClick={() => onEdit(t)}>Edit</button>
            {user?.role === 'admin' && (
              <button style={deleteButton} onClick={() => handleDelete(t._id)}>Delete</button>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Styles ---


// --- Styles ---
const containerStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: '#f0f6ff', // light blue background
  minHeight: '100vh'
};

const cardStyle = {
  background: '#ffffff',
  color: '#0a1d37',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 123, 255, 0.1)'
};

const grid = {
  display: 'grid',
  gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
  gap: '12px',
  marginBottom: '20px'
};

const buttonRow = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const editButton = {
  backgroundColor: '#007bff',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  boxShadow: '0 0 6px rgba(0, 123, 255, 0.2)'
};

const deleteButton = {
  backgroundColor: '#dc3545',
  color: '#ffffff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer',
  boxShadow: '0 0 6px rgba(220, 53, 69, 0.2)'
};

const haltedCardStyle = {
  backgroundColor: '#f0f0f0',
  color: '#777',
  border: '1px solid #ccc',
  opacity: 0.8
};
