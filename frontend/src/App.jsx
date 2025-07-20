// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Login from './pages/Login';
// import Signup from './pages/Signup';
// import Dashboard from './pages/Dashboard';
// import ProtectedRoute from './routes/ProtectedRoute';
// import { AuthProvider } from './context/authContext';

// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <Routes>
//           <Route path="/" element={<Login />} />
//           <Route path="/signup" element={<Signup />} />
//           <Route
//             path="/dashboard"
//             element={
//               <ProtectedRoute>
//                 <Dashboard />
//               </ProtectedRoute>
//             }
//           />
//         </Routes>
//       </Router>
//     </AuthProvider>
//   );
// }

// export default App;


import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import MyTasks from './pages/MyTasks';
import AllTasks from './pages/AllTasks';
import ProtectedRoute from './routes/ProtectedRoute';
import { AuthProvider } from './context/authContext';
import Navbar from './components/Navbar';

// dummy EnterTask and Reports for now (create these files later)
import EnterTask from './pages/EnterTask';
import Reports from './pages/Reports';

function App() {
  return (
    
      <Router>
        <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route
            path="/dashboard"
            element={
              <ProtectedRoute>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/mytasks"
            element={
              <ProtectedRoute>
                <MyTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/entertask"
            element={
              <ProtectedRoute>
                <EnterTask />
              </ProtectedRoute>
            }
          />
          <Route
            path="/alltasks"
            element={
              <ProtectedRoute requiredRole="admin">
                <AllTasks />
              </ProtectedRoute>
            }
          />
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRole="admin">
                <Reports />
              </ProtectedRoute>
            }
          />
        </Routes>
        </AuthProvider>
      </Router>
    
  );
}

export default App;
