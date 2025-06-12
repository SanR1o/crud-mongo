// client/src/pages/Categories.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import categoryService from '../services/category.service';

const Categories = () => {
const [categories, setCategories] = useState([]);
const [showDeleteModal, setShowDeleteModal] = useState(false);
const [categoryIdToDelete, setCategoryIdToDelete] = useState(null);
const [error, setError] = useState('');
const [success, setSuccess] = useState('');

useEffect(() => {
    fetchCategories();
}, []);

const fetchCategories = async () => {
try {
    const response = await categoryService.getAll();
    const categoriesFromApi = response.data.data || [];

    const enrichedCategories = await Promise.all(
    categoriesFromApi.map(async (cat) => {
        try {
        const subRes = await categoryService.getSubcategories(cat._id); // Nuevo método
        const subcategories = subRes.data.data || [];
        return {
            ...cat,
            subcategoryCount: subcategories.length,
            status: cat.status ?? false,
        };
        } catch (err) {
        console.error(`Error al cargar subcategorías de ${cat.name}`, err);
        return {
            ...cat,
            subcategoryCount: 0,
            status: cat.status ?? false,
        };
        }
    })
    );

    setCategories(enrichedCategories);
} catch (err) {
    setError('Error al cargar las categorías');
    console.error(err);
}
};


const handleDelete = (id) => {
    setCategoryIdToDelete(id);
    setShowDeleteModal(true);
};

const confirmDelete = async () => {
    try {
    await categoryService.remove(categoryIdToDelete);
    setCategories(categories.filter((cat) => cat._id !== categoryIdToDelete));
    setSuccess('Categoría eliminada correctamente');
    setShowDeleteModal(false);
    setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
    setError('Error al eliminar la categoría');
    console.error(err);
    }
};

return (
    <div className="container mt-4">
    <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Gestión de Categorías</h2>
        <Button as={Link} to="/categories/new" variant="primary">
        Crear Categoría
        </Button>
    </div>

    {error && <Alert variant="danger">{error}</Alert>}
    {success && <Alert variant="success">{success}</Alert>}

    <Table striped bordered hover responsive>
        <thead>
        <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            <th>Subcategorías</th>
            <th>Estado</th>
            <th>Acciones</th>
        </tr>
        </thead>
        <tbody>
        {categories.map((category) => (
            <tr key={category._id}>
            <td>{category.name}</td>
            <td>{category.description}</td>
            <td>
                <Badge bg="info">{category.subcategoryCount ?? 0}</Badge>
            </td>
            <td>
                <Badge bg={category.status ? 'success' : 'secondary'}>
                {category.status ? 'Activo' : 'Inactivo'}
                </Badge>
            </td>
            <td className="table-actions">
                <Button
                as={Link}
                to={`/categories/${category._id}`}
                variant="info"
                size="sm"
                className="me-2"
                >
                Editar
                </Button>
                <Button
                as={Link}
                to={`/categories/${category._id}/subcategories`}
                variant="warning"
                size="sm"
                className="me-2"
                >
                Subcategorías
                </Button>
                <Button
                variant="danger"
                size="sm"
                onClick={() => handleDelete(category._id)}
                >
                Eliminar
                </Button>
            </td>
            </tr>
        ))}
        </tbody>
    </Table>

    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
        <Modal.Title>Confirmar Eliminación</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        ¿Estás seguro de que deseas eliminar esta categoría? Esta acción también eliminará todas sus subcategorías.
        </Modal.Body>
        <Modal.Footer>
        <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancelar
        </Button>
        <Button variant="danger" onClick={confirmDelete}>
            Eliminar
        </Button>
        </Modal.Footer>
    </Modal>
    </div>
);
};

export default Categories;