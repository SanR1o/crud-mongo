// client/src/components/Category/CategoryForm.js
import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, ToggleButton, ToggleButtonGroup } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import categoryService from '../../services/category.service';

const CategoryForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState({
    name: '',
    description: '',
    status: true,
  });
  const [error, setError] = useState('');
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      fetchCategory(id);
    }
  }, [id]);

  const fetchCategory = async (id) => {
    try {
      const response = await categoryService.get(id);
      setCategory(response.data);
    } catch (err) {
      setError('Error al cargar la categoría');
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCategory({ ...category, [name]: value });
  };

  const handleStatusChange = (val) => {
    setCategory({ ...category, status: val });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await categoryService.update(id, category);
      } else {
        await categoryService.create(category);
      }
      navigate('/categories');
    } catch (err) {
      setError(err.response?.data?.message || 'Error al guardar la categoría');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      <h2>{isEditMode ? 'Editar Categoría' : 'Crear Categoría'}</h2>
      
      {error && <Alert variant="danger">{error}</Alert>}

      <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
          <Form.Label>Nombre</Form.Label>
          <Form.Control
            type="text"
            name="name"
            value={category.name}
            onChange={handleChange}
            required
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Descripción</Form.Label>
          <Form.Control
            as="textarea"
            rows={3}
            name="description"
            value={category.description}
            onChange={handleChange}
          />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label>Estado</Form.Label>
          <div>
            <ToggleButtonGroup
              type="radio"
              name="status"
              value={category.status}
              onChange={handleStatusChange}
            >
              <ToggleButton id="tbg-status-1" value={true} variant="outline-success">
                Activo
              </ToggleButton>
              <ToggleButton id="tbg-status-2" value={false} variant="outline-danger">
                Inactivo
              </ToggleButton>
            </ToggleButtonGroup>
          </div>
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
          {isEditMode ? 'Actualizar' : 'Crear'}
        </Button>
        <Button variant="secondary" onClick={() => navigate('/categories')}>
          Cancelar
        </Button>
      </Form>
    </div>
  );
};

export default CategoryForm;