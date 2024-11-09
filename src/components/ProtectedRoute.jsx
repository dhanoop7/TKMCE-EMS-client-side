import React from 'react';
import { Navigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const ProtectedRoute = ({ element: Component }) => {
  const accessToken = Cookies.get('accessToken');

  // If token exists, render the component; otherwise, redirect to login
  return accessToken ? <Component /> : <Navigate to="/unauthorized" replace />;
};

export default ProtectedRoute;