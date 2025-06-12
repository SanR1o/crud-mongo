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
    role: '' // ahora es string
  });
  const [errors, setErrors] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });
  const [currentUser, setCurrentUser] = useState(null);

  useEffect(() => {
    const user = authService.getCurrentUser();
    setCurrentUser(user);

    const fetchData = async () => {
      try {
        const rolesData = await userService.getRoles();
        setRoles(rolesData);

        if (id) {
          setLoading(true);
          const userResponse = await userService.getUserById(id);
          setFormData({
            username: userResponse.username,
            email: userResponse.email,
            password: '',
            role: userResponse.role || ''
          });
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Error al cargar datos');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const handleRoleChange = (e) => {
    setFormData({ ...formData, role: e.target.value });
    setErrors({ ...errors, role: '' });
  };

  const validateForm = () => {
    let isValid = true;
    const newErrors = { ...errors };

    if (!formData.username.trim()) {
      newErrors.username = 'Nombre de usuario es requerido';
      isValid = false;
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email es requerido';
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email no válido';
      isValid = false;
    }

    if (!id && !formData.password) {
      newErrors.password = 'Contraseña es requerida';
      isValid = false;
    } else if (formData.password && formData.password.length < 6) {
      newErrors.password = 'Mínimo 6 caracteres';
      isValid = false;
    }

    if (!formData.role) {
      newErrors.role = 'Seleccione un rol';
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setLoading(true);
    try {
      const userData = {
        username: formData.username,
        email: formData.email,
        role: formData.role
      };

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
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <Container className="text-center mt-5">
        <Spinner animation="border" />
      </Container>
    );
  }

  return (
    <Container className="mt-4">
      <h2>{id ? 'Editar Usuario' : 'Crear Usuario'}</h2>

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
                isInvalid={!!errors.username}
              />
              <Form.Control.Feedback type="invalid">
                {errors.username}
              </Form.Control.Feedback>
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
                isInvalid={!!errors.email}
                disabled={!!id}
              />
              <Form.Control.Feedback type="invalid">
                {errors.email}
              </Form.Control.Feedback>
            </Form.Group>
          </Col>
        </Row>

        <Form.Group className="mb-3">
          <Form.Label>
            Contraseña {id && <small className="text-muted">(Dejar en blanco para no cambiar)</small>}
          </Form.Label>
          <Form.Control
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            isInvalid={!!errors.password}
          />
          <Form.Control.Feedback type="invalid">
            {errors.password}
          </Form.Control.Feedback>
        </Form.Group>

        <Form.Group className="mb-4">
          <Form.Label>Rol</Form.Label>
          <div className="d-flex flex-wrap gap-3">
            {roles.map((role) => (
              <Form.Check
                key={role}
                type="radio"
                id={`role-${role}`}
                label={role}
                name="role"
                value={role}
                checked={formData.role === role}
                onChange={handleRoleChange}
                disabled={currentUser?.role !== 'admin' && role === 'admin'}
              />
            ))}
          </div>
          {errors.role && (
            <div className="text-danger small mt-1">{errors.role}</div>
          )}
        </Form.Group>

        <div className="d-flex justify-content-end gap-2">
          <Button variant="secondary" onClick={() => navigate('/users')}>
            Cancelar
          </Button>
          <Button variant="primary" type="submit" disabled={loading}>
            {loading ? (
              <>
                <Spinner size="sm" className="me-2" />
                Guardando...
              </>
            ) : (
              'Guardar'
            )}
          </Button>
        </div>
      </Form>
    </Container>
  );
};

export default UserForm;
