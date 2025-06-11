import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/auth.service';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get('http://localhost:3000/api/users', {
          headers: authService.getAuthHeader()
        });

        if (Array.isArray(response.data)) {
          setUsers(response.data);
        } else {
          setUsers([]);
        }
      } catch (err) {
        if (err.response?.status === 401) {
          // Token inválido o expirado
          authService.logout();
          navigate('/login');
        } else {
          setError(err.response?.data?.message || err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchUsers();
  }, [navigate]);

  if (loading) {
    return (
      <div className="text-center mt-5">
        <Spinner animation="border" />
        <p>Cargando usuarios...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger mt-3">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="container mt-4">
      <h2>Lista de Usuarios</h2>
      {authService.hasRole('admin') && (
        <Link to="/users/create" className="btn btn-primary mb-3">
          Crear Nuevo Usuario
        </Link>
      )}
      
      <Table striped bordered hover>
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Email</th>
            <th>Roles</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {users.length > 0 ? (
            users.map(user => (
              <tr key={user.id}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                <td>{user.roles?.join(', ') || 'Usuario'}</td>
                <td>
                  {authService.hasRole('admin') && (
                    <Link 
                      to={`/users/edit/${user.id}`} 
                      className="btn btn-sm btn-warning"
                    >
                      Editar
                    </Link>
                  )}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center">
                No hay usuarios registrados
              </td>
            </tr>
          )}
        </tbody>
      </Table>
    </div>
  );
};

export default Users;