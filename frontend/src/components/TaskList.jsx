
// import React from 'react';
// import axios from '../api/axios';

// export default function TaskList({ tasks, onDelete, onEdit }) {
//   const handleDelete = async (id) => {
//     try {
//       await axios.delete(`/tasks/${id}`);
//       onDelete(id);
//     } catch (err) {
//       console.error("Delete failed:", err);
//     }
//   };

//   return (
//     <div>
//       {tasks.map((t) => (
//         <div key={t._id} style={{ border: '1px solid gray', margin: '10px', padding: '10px' }}>
//           <p><b>Sl. No:</b> {t.slNo}</p>
//           <p><b>Project ID:</b> {t.projectId}</p>
//           <p><b>Fixture No.:</b> {t.fixtureNumber}</p>
//           <p><b>Category:</b> {t.category}</p>
//           <p><b>Person Handling:</b> {t.personHandling}</p>
//           <p><b>Supported Person:</b> {t.supportedPerson}</p>
//           <p><b>Priority:</b> {t.priority}</p>
//           <p><b>Task:</b> {t.task}</p>
//           <p><b>Start:</b> {new Date(t.start).toLocaleDateString()}</p>
//           <p><b>End:</b> {new Date(t.end).toLocaleDateString()}</p>
//           <p><b>Planned Hours:</b> {t.plannedHrs}</p>
//           <p><b>Actual Hours:</b> {t.actualHrs}</p>
//           <p><b>Status:</b> {t.status}</p>
//           <p><b>Days Taken:</b> {t.daysTaken}</p>
//           <p><b>Remarks:</b> {t.remarks}</p>

//           {t.createdBy?.email && (
//             <p><b>Created By:</b> {t.createdBy.email}</p>
//           )}

//           <button onClick={() => onEdit(t)}>Edit</button>
//           <button onClick={() => handleDelete(t._id)}>Delete</button>
//         </div>
//       ))}
//     </div>
//   );
// }

import React from 'react';
import axios from '../api/axios';

export default function TaskList({ tasks, onDelete, onEdit }) {
  const handleDelete = async (id) => {
    try {
      await axios.delete(`/tasks/${id}`);
      onDelete(id);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div style={containerStyle}>
      {tasks.map((t) => (
        <div key={t._id} style={cardStyle}>
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
            <span><b>Actual Hours:</b> {t.actualHrs}</span>
            <span><b>Status:</b> {t.status}</span>
            <span><b>Days Taken:</b> {t.daysTaken}</span>
            <span><b>Remarks:</b> {t.remarks}</span>
            {t.createdBy?.email && (
              <span><b>Created By:</b> {t.createdBy.email}</span>
            )}
          </div>

          <div style={buttonRow}>
            <button style={editButton} onClick={() => onEdit(t)}>Edit</button>
            <button style={deleteButton} onClick={() => handleDelete(t._id)}>Delete</button>
          </div>
        </div>
      ))}
    </div>
  );
}

// --- Styles ---

const containerStyle = {
  padding: '20px',
  display: 'flex',
  flexDirection: 'column',
  gap: '20px',
  backgroundColor: '#121212',
  minHeight: '100vh'
};

const cardStyle = {
  background: '#1e1e1e',
  color: '#fff',
  padding: '20px',
  borderRadius: '10px',
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.4)'
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
  backgroundColor: '#3b82f6',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
};

const deleteButton = {
  backgroundColor: '#ef4444',
  color: '#fff',
  border: 'none',
  padding: '8px 16px',
  borderRadius: '6px',
  cursor: 'pointer'
};
