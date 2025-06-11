import api from '../utils/axiosInterceptor';

class UserService {
  getAllUsers() {
    return api.get('/users');
  }

  getUserById(id) {
    return api.get(`/users/${id}`);
  }

  createUser(userData) {
    return api.post('/users', userData);
  }

  updateUser(id, userData) {
    return api.put(`/users/${id}`, userData);
  }

  deleteUser(id) {
    return api.delete(`/users/${id}`);
  }

  getRoles() {
    return api.get('/roles'); // Asumiendo que tienes un endpoint para obtener roles
  }
}

export default new UserService();