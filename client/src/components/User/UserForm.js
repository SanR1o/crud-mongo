import React, { useState, useEffect } from 'react';
import { Form, Button, Container, Alert, Spinner, Row, Col } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import userService from '../../services/user.service';
import authService from '../../services/auth.service';

const UserForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [roles, setRoles] = useState([]);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    roles: []
  });

  useEffect(() => {
    if (id) {
      fetchUser();
    }
    fetchRoles();
  }, [id]);

  const fetchUser = async () => {
    try {
      setLoading(true);
      const response = await userService.getUserById(id);
      setFormData({
        username: response.data.username,
        email: response.data.email,
        password: '',
        roles: response.data.roles || [response.data.role]
      });
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || 'Error al cargar usuario');
      setLoading(false);
    }
  };

  const fetchRoles = async () => {
    try {
      const response = await userService.getRoles();
      setRoles(response.data);
    } catch (err) {
      console.error('Error al cargar roles:', err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleRoleChange = (e) => {
    const { value, checked } = e.target;
    setFormData(prev => {
      const newRoles = checked
        ? [...prev.roles, value]
        : prev.roles.filter(role => role !== value);
      return { ...prev, roles: newRoles };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        roles: formData.roles
      };

      // Solo incluir password si está en modo creación o si se cambió
      if (formData.password) {
        userData.password = formData.password;
      }

      if (id) {
        await userService.updateUser(id, userData);
      } else {
        await userService.createUser(userData);
      }
      navigate('/users');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar usuario');
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Cargando...</span>
        </Spinner>
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>{id ? 'Editar Usuario' : 'Crear Nuevo Usuario'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Row>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Nombre de Usuario</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
              />
            </Form.Group>
          </Col>
          <Col md={6}>
            <Form.Group className="mb-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={!!id} // Email no editable en actualización
              />
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>Contraseña</Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            required={!id} // Solo requerido en creación
            placeholder={id ? "Dejar en blanco para no cambiar" : ""}
          />
          {id && <Form.Text className="text-muted">
            Dejar en blanco para mantener la contraseña actual
          </Form.Text>}
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Roles</Form.Label>
          <div>
            {roles.map(role => (
              <Form.Check
                key={role}
                type="checkbox"
                id={`role-${role}`}
                label={role}
                value={role}
                checked={formData.roles.includes(role)}
                onChange={handleRoleChange}
                disabled={!authService.hasRole('admin')} // Solo admin puede cambiar roles
              />
            ))}
          </div>
        </Form.Group>

        <div className="d-flex justify-content-end">
          <Button variant="secondary" className="me-2" onClick={() => navigate('/users')}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
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
                Guardando...
              </>
            ) : 'Guardar'}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserForm;