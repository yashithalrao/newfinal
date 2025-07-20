// import React, { useContext } from 'react';
// import { Navigate } from 'react-router-dom';
// import { AuthContext } from '../context/authContext';

// const ProtectedRoute = ({ children }) => {
//   const { user } = useContext(AuthContext);
//   return user ? children : <Navigate to="/" />;
// };

// export default ProtectedRoute;

import { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/authContext';

const ProtectedRoute = ({ children, requiredRole }) => {
  const { user } = useContext(AuthContext);

  if (!user) return <Navigate to="/" />;

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/dashboard" />;
  }

  return children;
};

export default ProtectedRoute;
