import React, { useState, useEffect } from 'react';
import { Form, Button, Alert, ToggleButtonGroup, ToggleButton } from 'react-bootstrap';
import { useNavigate, useParams } from 'react-router-dom';
import subcategoryService from '../../services/subcategory.service';
import categoryService from '../../services/category.service';

const SubcategoryForm = () => {
const { categoryId, id } = useParams();
const navigate = useNavigate();
const [subcategory, setSubcategory] = useState({
    name: '',
    description: '',
    status: true,
    category: categoryId || '',
});
const [categories, setCategories] = useState([]);
const [error, setError] = useState('');
const [isEditMode, setIsEditMode] = useState(false);

useEffect(() => {
    fetchCategories();
    if (id) {
    setIsEditMode(true);
    fetchSubcategory(id);
    }
}, [id]);

const fetchCategories = async () => {
    try {
    const res = await categoryService.getAll();
    setCategories(res.data.data || []);
    } catch (err) {
    setError('Error al cargar las categorías');
    console.error(err);
    }
};

const fetchSubcategory = async (id) => {
    try {
    const res = await subcategoryService.get(id);
    setSubcategory(res.data);
    } catch (err) {
    setError('Error al cargar la subcategoría');
    console.error(err);
    }
};

const handleChange = (e) => {
    const { name, value } = e.target;
    setSubcategory({ ...subcategory, [name]: value });
};

const handleStatusChange = (val) => {
    setSubcategory({ ...subcategory, status: val });
};

const handleSubmit = async (e) => {
    e.preventDefault();
    try {
    if (isEditMode) {
        await subcategoryService.update(id, subcategory);
    } else {
        await subcategoryService.create(subcategory);
    }
    navigate(`/categories/${subcategory.category}/subcategories`);
    } catch (err) {
    setError(err.response?.data?.message || 'Error al guardar la subcategoría');
    console.error(err);
    }
};

return (
    <div className="container mt-4">
    <h2>{isEditMode ? 'Editar Subcategoría' : 'Crear Subcategoría'}</h2>

    {error && <Alert variant="danger">{error}</Alert>}

    <Form onSubmit={handleSubmit}>
        <Form.Group className="mb-3">
        <Form.Label>Nombre</Form.Label>
        <Form.Control
            type="text"
            name="name"
            value={subcategory.name}
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
            value={subcategory.description}
            onChange={handleChange}
        />
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Categoría</Form.Label>
        <Form.Select
            name="category"
            value={subcategory.category}
            onChange={handleChange}
            required
        >
            <option value="">Seleccione una categoría</option>
            {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
                {cat.name}
            </option>
            ))}
        </Form.Select>
        </Form.Group>

        <Form.Group className="mb-3">
        <Form.Label>Estado</Form.Label>
        <div>
            <ToggleButtonGroup
            type="radio"
            name="status"
            value={subcategory.status}
            onChange={handleStatusChange}
            >
            <ToggleButton id="status-1" value={true} variant="outline-success">
                Activo
            </ToggleButton>
            <ToggleButton id="status-2" value={false} variant="outline-danger">
                Inactivo
            </ToggleButton>
            </ToggleButtonGroup>
        </div>
        </Form.Group>

        <Button variant="primary" type="submit" className="me-2">
        {isEditMode ? 'Actualizar' : 'Crear'}
        </Button>
        <Button
        variant="secondary"
        onClick={() => navigate(`/categories/${subcategory.category}/subcategories`)}
        >
        Cancelar
        </Button>
    </Form>
    </div>
);
};

export default SubcategoryForm;