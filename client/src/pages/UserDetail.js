import React, { useState, useEffect } from 'react';
import { Container, Card, Button, Alert, Spinner, Row, Col, Badge } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../services/user.service';
import authService from '../services/auth.service';

const UserDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
  const fetchUser = async () => {
    try {
      const response = await userService.getUserById(id);
      setUser(response.data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuario');
      setLoading(false);
    }
  };

  fetchUser();
}, [id]); 

  if (loading) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="danger">Usuario no encontrado</Alert>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Detalles del Usuario</h2>
        <Button variant="secondary" onClick={() => navigate('/users')}>
          Volver
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}

      <Card>
        <Card.Body>
          <Row>
            <Col md={6}>
              <h4>Información Básica</h4>
              <p><strong>Nombre:</strong> {user.username || 'N/A'}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p><strong>Fecha de Creación:</strong> {new Date(user.createdAt).toLocaleDateString()}</p>
            </Col>
            <Col md={6}>
              <h4>Roles y Permisos</h4>
              <div>
                {(user.roles || [user.role]).map(role => (
                  <Badge key={role} bg="primary" className="me-2">
                    {role}
                  </Badge>
                ))}
              </div>
            </Col>
          </Row>

          {authService.hasRole('admin') && (
            <div className="mt-4">
              <Button 
                variant="primary" 
                onClick={() => navigate(`/users/edit/${user._id}`)}
                className="me-2"
              >
                Editar Usuario
              </Button>
              <Button 
                variant="danger"
                onClick={() => navigate(`/users/delete/${user._id}`)}
              >
                Eliminar Usuario
              </Button>
            </div>
          )}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default UserDetail;