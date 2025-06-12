// client/src/pages/Subcategories.js
import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Alert, Badge, Breadcrumb } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import subcategoryService from '../services/subcategory.service';
import categoryService from '../services/category.service';

const Subcategories = ({ showAll = false }) => {
  const { categoryId } = useParams();
  const [subcategories, setSubcategories] = useState([]);
  const [category, setCategory] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [subcategoryIdToDelete, setSubcategoryIdToDelete] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    if (showAll) {
      fetchAllSubcategories();
    } else {
      fetchCategory();
      fetchSubcategoriesByCategory();
    }
  }, [categoryId, showAll]);

  const fetchCategory = async () => {
    try {
      const response = await categoryService.get(categoryId);
      setCategory(response.data);
    } catch (err) {
      setError('Error al cargar la categoría');
      console.error(err);
    }
  };

  const fetchSubcategoriesByCategory = async () => {
    try {
      const response = await subcategoryService.getByCategory(categoryId);
      setSubcategories(response.data);
    } catch (err) {
      setError('Error al cargar las subcategorías');
      console.error(err);
    }
  };

  const fetchAllSubcategories = async () => {
    try {
      const response = await subcategoryService.getAll();
      setSubcategories(response.data.data || response.data); // depende de tu backend
    } catch (err) {
      setError('Error al cargar todas las subcategorías');
      console.error(err);
    }
  };

  const handleDelete = (id) => {
    setSubcategoryIdToDelete(id);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    try {
      await subcategoryService.remove(subcategoryIdToDelete);
      setSubcategories(subcategories.filter((sub) => sub._id !== subcategoryIdToDelete));
      setSuccess('Subcategoría eliminada correctamente');
      setShowDeleteModal(false);
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      setError('Error al eliminar la subcategoría');
      console.error(err);
    }
  };

  return (
    <div className="container mt-4">
      {!showAll && category && (
        <Breadcrumb>
          <Breadcrumb.Item linkAs={Link} linkProps={{ to: '/categories' }}>
            Categorías
          </Breadcrumb.Item>
          <Breadcrumb.Item active>{category.name}</Breadcrumb.Item>
        </Breadcrumb>
      )}

      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>
          {showAll
            ? 'Todas las Subcategorías'
            : category
            ? `Subcategorías de ${category?.name}`
            : 'Cargando categoría...'}
        </h2>
        <Button
          as={Link}
          to={
            showAll
              ? '/subcategories/new'
              : `/categories/${categoryId}/subcategories/new`
          }
          variant="primary"
        >
          Crear Subcategoría
        </Button>
      </div>

      {error && <Alert variant="danger">{error}</Alert>}
      {success && <Alert variant="success">{success}</Alert>}

      <Table striped bordered hover responsive>
        <thead>
          <tr>
            <th>Nombre</th>
            <th>Descripción</th>
            {showAll && <th>Categoría (ID)</th>}
            <th>Estado</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {subcategories.map((subcategory) => (
            <tr key={subcategory._id}>
              <td>{subcategory.name}</td>
              <td>{subcategory.description}</td>
              {showAll && <td>{subcategory.category || '-'}</td>}
              <td>
                <Badge bg={subcategory.status ? 'success' : 'secondary'}>
                  {subcategory.status ? 'Activo' : 'Inactivo'}
                </Badge>
              </td>
              <td className="table-actions">
                <Button
                  as={Link}
                  to={
                    showAll
                      ? `/categories/${subcategory.category}/subcategories/${subcategory._id}`
                      : `/categories/${categoryId}/subcategories/${subcategory._id}`
                  }
                  variant="info"
                  size="sm"
                  className="me-2"
                >
                  Editar
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(subcategory._id)}
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
          ¿Estás seguro de que deseas eliminar esta subcategoría?
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

export default Subcategories;