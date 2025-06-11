import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

const Sidebar = () => {
  const location = useLocation();
  const user = authService.getCurrentUser();

  console.log('Usuario actual:', user); // Verifica en consola del navegador
  console.log('Roles del usuario:', user?.roles); // Verifica los roles

  return (
    <Nav className="flex-column bg-light p-3" style={{ width: '250px' }}>
      <Nav.Item>
        <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>
          Dashboard
        </Nav.Link>
      </Nav.Item>
      
      {/* Verificación segura de roles */}
      {(authService.hasRole('admin') || authService.hasRole('moderator')) && (
        <Nav.Item>
          <Nav.Link as={Link} to="/users" active={location.pathname === '/users'}>
            Usuarios
          </Nav.Link>
        </Nav.Item>
      )}
      
      <Nav.Item>
        <Nav.Link as={Link} to="/categories" active={location.pathname.startsWith('/categories')}>
          Categorías
        </Nav.Link>
      </Nav.Item>
      
      <Nav.Item>
        <Nav.Link as={Link} to="/products" active={location.pathname.startsWith('/products')}>
          Productos
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
  
};

export default Sidebar;