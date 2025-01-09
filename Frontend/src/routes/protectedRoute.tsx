import React, { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

// Define the props type
interface ProtectedRouteProps {
  children: ReactNode; // ReactNode allows any valid React child elements
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const token = localStorage.getItem('authToken');
  return token ? children : <Navigate to="/signin" />;
};

export default ProtectedRoute;
