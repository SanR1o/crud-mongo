import React, { useState, useEffect } from 'react';
import { Table, Button, Spinner } from 'react-bootstrap';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import authService from '../services/auth.service';
import { Pagination } from 'react-bootstrap';
import { exportToExcel, exportToPDF } from '../utils/exportUtils';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const usersPerPage = 10;

  const navigate = useNavigate();

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        let url = `http://localhost:3000/api/users?page=${currentPage}&limit=${usersPerPage}`;
        if (searchTerm) {
          url += `&search=${searchTerm}`;
        }

        const response = await axios.get(url, {
          headers: authService.getAuthHeader()
        });

        if (response.data) {
          setUsers(response.data.users || []);
          setTotalUsers(response.data.total || 0);
          setTotalPages(response.data.totalPages || 1);
        } else {
          setUsers([]);
          setTotalUsers(0);
          setTotalPages(1);
        }
      } catch (err) {
        if (err.response?.status === 401) {
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
  }, [navigate, currentPage, searchTerm]);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Resetear a la primera página al buscar
  };

  const handleExport = (exportFunction, fileName) => {
    // Preparar datos para exportación
    const exportData = users.map(user => ({
      ID: user.id,
      Nombre: user.name,
      Email: user.email,
      Roles: user.roles?.join(', ') || 'Usuario'
    }));
    
    exportFunction(exportData, fileName);
  };

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

  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  return (
    <div className="container mt-4">
      <h2>Lista de Usuarios</h2>
      
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div className="d-flex">
          {authService.hasRole('admin') && (
            <Link to="/users/create" className="btn btn-primary me-2">
              Crear Nuevo Usuario
            </Link>
          )}
          
          <Button 
            variant="success" 
            className="me-2"
            onClick={() => handleExport(exportToExcel, `usuarios-pagina-${currentPage}`)}
          >
            Exportar a Excel
          </Button>
          <Button 
            variant="danger"
            onClick={() => handleExport(exportToPDF, `usuarios-pagina-${currentPage}`)}
          >
            Exportar a PDF
          </Button>
        </div>
        
        <div className="w-25">
          <input
            type="text"
            className="form-control"
            placeholder="Buscar usuarios..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
      </div>

      <div className="text-muted mb-3">
        Mostrando {(currentPage - 1) * usersPerPage + 1} - {Math.min(currentPage * usersPerPage, totalUsers)} de {totalUsers} usuarios
      </div>
      
      <Table striped bordered hover responsive>
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

      {totalPages > 1 && (
        <div className="d-flex justify-content-center mt-4">
          <Pagination>
            <Pagination.First 
              onClick={() => handlePageChange(1)} 
              disabled={currentPage === 1} 
            />
            <Pagination.Prev 
              onClick={() => handlePageChange(currentPage - 1)} 
              disabled={currentPage === 1} 
            />
            
            {pageNumbers.map(number => (
              <Pagination.Item
                key={number}
                active={number === currentPage}
                onClick={() => handlePageChange(number)}
              >
                {number}
              </Pagination.Item>
            ))}
            
            <Pagination.Next 
              onClick={() => handlePageChange(currentPage + 1)} 
              disabled={currentPage === totalPages} 
            />
            <Pagination.Last 
              onClick={() => handlePageChange(totalPages)} 
              disabled={currentPage === totalPages} 
            />
          </Pagination>
        </div>
      )}
    </div>
  );
};

export default Users;