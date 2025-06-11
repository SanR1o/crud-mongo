import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

const PrivateRoute = ({ children }) => {
  const location = useLocation();
  const user = authService.getCurrentUser();

  if (!user) {
    // Redirigir al login, guardando la ubicación a la que intentaban acceder
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};

export default PrivateRoute;