import React from 'react';
import { Nav } from 'react-bootstrap';
import { Link, useLocation } from 'react-router-dom';
import authService from '../../services/auth.service';

const Sidebar = () => {
  const location = useLocation();
  //const user = authService.getCurrentUser();

  return (
    <Nav className="flex-column bg-light p-3" style={{ width: '250px', height: '100vh' }}>
      <Nav.Item>
        <Nav.Link as={Link} to="/dashboard" active={location.pathname === '/dashboard'}>
          Dashboard
        </Nav.Link>
      </Nav.Item>

      {/* Usuarios: solo visible para admin y coordinador */}
      {(authService.hasRole('admin') || authService.hasRole('coordinador')) && (
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/users" 
            active={location.pathname.startsWith('/users')}
          >
            Usuarios
          </Nav.Link>
        </Nav.Item>
      )}

      {/* Categorías: visible para admin y coordinador */}
      {(authService.hasRole('admin') || authService.hasRole('coordinador')) && (
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/categories" 
            active={location.pathname.startsWith('/categories')}
          >
            Categorías
          </Nav.Link>
        </Nav.Item>
      )}

      {/* Subcategorías: visible para admin y coordinador */}
      {(authService.hasRole('admin') || authService.hasRole('coordinador')) && (
        <Nav.Item>
          <Nav.Link 
            as={Link} 
            to="/subcategories" 
            active={location.pathname === '/subcategories'}
          >
            Subcategorías
          </Nav.Link>
        </Nav.Item>
      )}

      {/* Productos: visible para cualquier usuario autenticado */}
      <Nav.Item>
        <Nav.Link 
          as={Link} 
          to="/products" 
          active={location.pathname.startsWith('/products')}
        >
          Productos
        </Nav.Link>
      </Nav.Item>
    </Nav>
  );
};

export default Sidebar;