
// import React, { useEffect, useState } from 'react';
// import axios from '../api/axios';
// import TaskList from '../components/TaskList';
// import TaskForm from '../components/TaskForm';

// export default function AllTasks() {
//   const [tasks, setTasks] = useState([]);
//   const [editTask, setEditTask] = useState(null);

//   useEffect(() => {
//     const fetchAllTasks = async () => {
//       try {
//         const res = await axios.get('/tasks/all');
//         setTasks(res.data);
//       } catch (err) {
//         console.error("Error fetching all tasks:", err);
//       }
//     };

//     fetchAllTasks();
//   }, []);

//   const handleTaskCreated = (newTask) => {
//     setTasks(prev => [...prev, newTask]);
//   };

//   const handleTaskUpdated = (updatedTask) => {
//     setTasks(prev =>
//       prev.map(task => (task._id === updatedTask._id ? updatedTask : task))
//     );
//     setEditTask(null);
//   };

//   const handleDelete = (id) => {
//     setTasks(prev => prev.filter(task => task._id !== id));
//   };

//   return (
//     <div>
//       <h2>All Tasks (Admin View)</h2>

//       <TaskList
//         tasks={tasks}
//         onEdit={setEditTask}
//         onDelete={handleDelete}
//       />
//     </div>
//   );
// }

import React, { useEffect, useState } from 'react';
import axios from '../api/axios';
import TaskList from '../components/TaskList';
import TaskForm from '../components/TaskForm';

export default function AllTasks() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);

  useEffect(() => {
    const fetchAllTasks = async () => {
      try {
        const res = await axios.get('/tasks/all');
        setTasks(res.data);
      } catch (err) {
        console.error("Error fetching all tasks:", err);
      }
    };

    fetchAllTasks();
  }, []);

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
    <div style={{ backgroundColor: '#121212', color: '#e0e0e0', padding: '40px' }}>
      <h2 style={{ color: '#ffffff', marginBottom: '20px' }}>All Tasks (Admin View)</h2>

      <div style={{ marginTop: '30px', padding: '20px', background: '#1a1a1a', borderRadius: '10px' }}>
        {/* Task List */}
        <TaskList
          tasks={tasks}
          onEdit={setEditTask}
          onDelete={handleDelete}
        />
      </div>
    </div>
  );
}
