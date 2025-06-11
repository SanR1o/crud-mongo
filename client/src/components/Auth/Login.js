import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import authService from '../../services/auth.service';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Verificar si ya está logueado al cargar el componente
  useEffect(() => {
    const user = authService.getCurrentUser();
    if (user) {
      navigate('/dashboard');
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const userData = await authService.login(email, password);
      console.log('Login exitoso, datos del usuario:', userData);
      navigate('/dashboard');
    } catch (err) {
      console.error('Error durante login:', {
        message: err.message,
        response: err.response?.data
      });
      
      const errorMessage = err.response?.data?.message || 
                        err.message || 
                        'Error al iniciar sesión';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };


  return (
    <Container className="d-flex justify-content-center align-items-center" style={{ minHeight: '100vh' }}>
      <div style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="text-center mb-4">Iniciar Sesión</h2>
        {error && <Alert variant="danger">{error}</Alert>}
        
        <Form onSubmit={handleSubmit} className="border p-4 rounded shadow-sm bg-white">
          <Form.Group className="mb-3">
            <Form.Label>Email</Form.Label>
            <Form.Control
              type="email"
              placeholder="Ingresa tu email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              placeholder="Ingresa tu contraseña"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button 
            variant="primary" 
            type="submit" 
            className="w-100"
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner
                  as="span"
                  animation="border"
                  size="sm"
                  role="status"
                  aria-hidden="true"
                  className="me-2"
                />
                Verificando...
              </>
            ) : 'Iniciar Sesión'}
          </Button>
        </Form>
      </div>
    </Container>
  );
};

export default Login;