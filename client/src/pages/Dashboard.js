import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import authService from '../services/auth.service';
import "../components/Dashboard.css"

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    users: 0,
    products: 0,
    categories: 0
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const currentUser = authService.getCurrentUser();
    console.log('Usuario actual:', currentUser);
    
    if (!currentUser) {
      navigate('/login');
      return;
    }

    setUser(currentUser);
    fetchDashboardData();
  }, [navigate]);

  const fetchDashboardData = async () => {
    try {
      // Aquí irían las llamadas a tu API para obtener estadísticas
      // Estos son datos de ejemplo - reemplaza con llamadas reales a tu backend
      const mockStats = {
        users: 24,
        products: 156,
        categories: 12
      };
      
      setStats(mockStats);
      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar datos del dashboard');
      setLoading(false);
    }
  };

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  if (!user) {
    return (
      <Container className="mt-5">
        <Alert variant="info">Cargando dashboard...</Alert>
      </Container>
    );
  }

  return (
    <Container fluid className="dashboard-container">
      <Row className="mb-4">
        <Col>
          <h2 className="dashboard-title">Panel de Administración</h2>
          <p className="text-muted">Bienvenido, {user.email}</p>
        </Col>
        <Col md="auto">
          <Button variant="outline-danger" onClick={handleLogout}>
            Cerrar Sesión
          </Button>
        </Col>
      </Row>

      {error && (
        <Row className="mb-4">
          <Col>
            <Alert variant="danger">{error}</Alert>
          </Col>
        </Row>
      )}

      {loading ? (
        <Row className="justify-content-center">
          <Col md={6} className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Cargando...</span>
            </div>
            <p className="mt-2">Cargando datos del dashboard...</p>
          </Col>
        </Row>
      ) : (
        <>
          <Row className="mb-4">
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Usuarios</Card.Title>
                  <Card.Text className="display-4">{stats.users}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/users')}
                    disabled={!authService.hasRole('admin')}
                  >
                    Gestionar Usuarios
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Productos</Card.Title>
                  <Card.Text className="display-4">{stats.products}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/products')}
                  >
                    Gestionar Productos
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={4}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Categorías</Card.Title>
                  <Card.Text className="display-4">{stats.categories}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/categories')}
                  >
                    Gestionar Categorías
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Información del Usuario</Card.Title>
                  <Card.Text>
                    <strong>Email:</strong> {user.email}<br />
                    <strong>Rol:</strong> {user.role || user.roles?.join(', ')}<br />
                    <strong>ID:</strong> {user.id}
                  </Card.Text>
                  {authService.hasRole('admin') && (
                    <Alert variant="info">
                      Tienes privilegios de administrador
                    </Alert>
                  )}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}
    </Container>
  );
};

export default Dashboard;