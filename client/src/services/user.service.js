import api from '../utils/axiosInterceptor';

class UserService {
  async getAllUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      const response = await api.get(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      throw error;
    }
  }

  async createUser(userData) {
    try {
      const response = await api.post('/users', userData);
      return response.data;
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }

  async updateUser(id, userData) {
    try {
      const response = await api.put(`/users/${id}`, userData);
      return response.data;
    } catch (error) {
      console.error('Error updating user:', error);
      throw error;
    }
  }

  async deleteUser(id) {
    try {
      const response = await api.delete(`/users/${id}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  }

  async getRoles() {
    // Roles fijos basados en tu backend
    return ['admin', 'coordinador', 'auxiliar'];
  }

  // Verifica si el usuario actual puede editar otro usuario
  canEdit(currentUser, targetUser) {
    if (!currentUser || !targetUser) return false;
    if (currentUser.roles.includes('admin')) return true;
    if (currentUser.roles.includes('coordinador')) return true;
    if (currentUser._id === targetUser._id) return true; // Puede editarse a sí mismo
    return false;
  }

  // Verifica si el usuario actual puede eliminar otro usuario
  canDelete(currentUser) {
    if (!currentUser) return false;
    return currentUser.roles.includes('admin');
  }
}

export default new UserService();