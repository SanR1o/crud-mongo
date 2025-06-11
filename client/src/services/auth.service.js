import axios from 'axios';

const API_URL = 'http://localhost:3000/api/auth/';

class AuthService {
  async login(email, password) {
    try {
      const response = await axios.post(API_URL + 'signin', {
        email,
        password
      });
      
      console.log('Respuesta completa:', response.data); // Para diagnóstico
      
      // Aquí está el cambio importante - usamos response.data.token
      if (response.data.token) {
        const userData = {
          ...response.data.user,  // Extraemos los datos del usuario
          accessToken: response.data.token  // Usamos el token de la respuesta
        };
        localStorage.setItem('user', JSON.stringify(userData));
        console.log('Usuario guardado:', userData); // Verificación
        return userData;
      }
      throw new Error('No se recibió token de acceso');
    } catch (error) {
      console.error('Error completo:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  }

  logout() {
    localStorage.removeItem('user');
  }

  getCurrentUser() {
    const user = localStorage.getItem('user');
    return user ? JSON.parse(user) : null;
  }

  hasRole(requiredRole) {
    const user = this.getCurrentUser();
    if (!user) return false;
    
    // Verifica tanto 'role' como 'roles' para mayor compatibilidad
    const userRole = user.role || (user.roles && user.roles[0]);
    
    if (Array.isArray(requiredRole)) {
      return requiredRole.includes(userRole);
    }
    return userRole === requiredRole;
  }

  getAuthHeader() {
    const user = this.getCurrentUser();
    if (user && user.accessToken) {
      return { 'Authorization': 'Bearer ' + user.accessToken };
    }
    return {};
  }
}

export default new AuthService();