// client/src/services/subcategory.service.js
import api from '../utils/axiosInterceptor';

const ENDPOINT = '/subcategories/';

const getAll = () => api.get(ENDPOINT);
const getByCategory = (categoryId) => api.get(`${ENDPOINT}category/${categoryId}`);
const get = (id) => api.get(`${ENDPOINT}${id}`);
const create = (data) => api.post(ENDPOINT, data);
const update = (id, data) => api.put(`${ENDPOINT}${id}`, data);
const remove = (id) => api.delete(`${ENDPOINT}${id}`);

const subcategoryService = {
  getAll,
  getByCategory,
  get,
  create,
  update,
  remove,
};

export default subcategoryService;