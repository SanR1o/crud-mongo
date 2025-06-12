import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/Common/PrivateRoute';
import Users from './pages/Users';
import UserForm from './components/User/UserForm';
import UserDetail from './pages/UserDetail';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />
        
        {/* Rutas protegidas con Layout */}
        <Route element={<Layout />}>
          {/* Dashboard - accesible para cualquier usuario autenticado */}
          <Route 
            path="/dashboard" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
          
          {/* Gestión de usuarios */}
          <Route 
            path="/users" 
            element={
              <PrivateRoute requiredRoles={['admin', 'moderator']}>
                <Users />
              </PrivateRoute>
            } 
          />
          
          {/* Crear usuario - solo admin */}
          <Route 
            path="/users/create" 
            element={
              <PrivateRoute requiredRoles={['admin']}>
                <UserForm />
              </PrivateRoute>
            } 
          />
          
          {/* Editar usuario - solo admin */}
          <Route 
            path="/users/edit/:id" 
            element={
              <PrivateRoute requiredRoles={['admin']}>
                <UserForm />
              </PrivateRoute>
            } 
          />
          
          {/* Detalle de usuario - accesible para cualquier usuario autenticado */}
          <Route 
            path="/users/detail/:id" 
            element={
              <PrivateRoute>
                <UserDetail />
              </PrivateRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;