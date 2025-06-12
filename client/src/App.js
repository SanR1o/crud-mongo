import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import Login from './components/Auth/Login';
import Layout from './components/Layout/Layout';
import Dashboard from './pages/Dashboard';
import PrivateRoute from './components/Common/PrivateRoute';
import Users from './pages/Users';
import UserForm from './pages/User/UserForm';
import UserDetail from './pages/User/UserDetail';
// Nuevas importaciones
import Categories from './pages/Categories';
import Subcategories from './pages/Subcategories';
import CategoryForm from './pages/Category/CategoryForm';
import SubcategoryForm from './pages/Subcategory/SubcategoryForm';

function App() {
  return (
    <Router>
      <Routes>
        {/* Rutas públicas */}
        <Route path="/login" element={<Login />} />
        <Route path="/" element={<Login />} />

        {/* Rutas protegidas con Layout */}
        <Route element={<Layout />}>
          {/* Dashboard */}
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
          <Route 
            path="/users/create" 
            element={
              <PrivateRoute requiredRoles={['admin']}>
                <UserForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/users/edit/:id" 
            element={
              <PrivateRoute requiredRoles={['admin']}>
                <UserForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/users/detail/:id" 
            element={
              <PrivateRoute>
                <UserDetail />
              </PrivateRoute>
            } 
          />

          {/* Gestión de categorías */}
          <Route 
            path="/categories" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <Categories />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/categories/new" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <CategoryForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/categories/:id" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <CategoryForm />
              </PrivateRoute>
            } 
          />

          <Route 
            path="/subcategories" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <Subcategories showAll />
              </PrivateRoute>
            }
          />


          {/* Gestión de subcategorías */}
          <Route 
            path="/categories/:categoryId/subcategories" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <Subcategories />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/categories/:categoryId/subcategories/new" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <SubcategoryForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/subcategories/new" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <SubcategoryForm />
              </PrivateRoute>
            } 
          />
          <Route 
            path="/categories/:categoryId/subcategories/:id" 
            element={
              <PrivateRoute requiredRoles={['admin', 'coordinador']}>
                <SubcategoryForm />
              </PrivateRoute>
            } 
          />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;