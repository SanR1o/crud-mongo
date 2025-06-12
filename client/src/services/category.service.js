import api from '../utils/axiosInterceptor';

const ENDPOINT = '/categories/';

const getAll = () => api.get(ENDPOINT);
const get = (id) => api.get(`${ENDPOINT}${id}`);
const create = (data) => api.post(ENDPOINT, data);
const update = (id, data) => api.put(`${ENDPOINT}${id}`, data);
const remove = (id) => api.delete(`${ENDPOINT}${id}`);

// Obtener subcategorías por ID de categoría (nuevo endpoint RESTful)
const getSubcategories = (categoryId) => api.get(`${ENDPOINT}${categoryId}/subcategories`);

const categoryService = {
  getAll,
  get,
  create,
  update,
  remove,
  getSubcategories
};

export default categoryService;