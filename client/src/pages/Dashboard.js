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
      const headers = authService.getAuthHeader();

      const [usersRes, productsRes, categoriesRes, subcategoriesRes] = await Promise.all([
        fetch('http://localhost:3000/api/users', { headers }),
        fetch('http://localhost:3000/api/products', { headers }),
        fetch('http://localhost:3000/api/categories', { headers }),
        fetch('http://localhost:3000/api/subcategories', { headers })
      ]);

      const [users, products, categories, subcategories] = await Promise.all([
        usersRes.json(),
        productsRes.json(),
        categoriesRes.json(),
        subcategoriesRes.json()
      ]);

      setStats({
        users: users.data?.length || 0,
        products: products.data?.length || 0,
        categories: categories.data?.length || 0,
        subcategories: subcategories.data?.length || 0
      });

      setLoading(false);
    } catch (err) {
      console.error('Error al cargar datos:', err);
      setError('Error al cargar datos del dashboard');
      setLoading(false);
    }
  };


  /*const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };*/

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
          <p className="text-muted">Bienvenido, {user.username}</p>
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

          <Row className="mb-4">
            <Col md={3}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Usuarios</Card.Title>
                  <Card.Text className="display-4">{stats.users}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/users')}
                    disabled={!(authService.hasRole('admin') || authService.hasRole('coordinador'))}
                  >
                    Gestionar Usuarios
                  </Button>
                </Card.Body>
              </Card>
            </Col>
            <Col md={3}>
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
            <Col md={3}>
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
            <Col md={3}>
              <Card className="dashboard-card">
                <Card.Body>
                  <Card.Title>Subcategorías</Card.Title>
                  <Card.Text className="display-4">{stats.subcategories}</Card.Text>
                  <Button 
                    variant="primary" 
                    onClick={() => navigate('/subcategories')}
                  >
                    Gestionar Subcategorías
                  </Button>
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