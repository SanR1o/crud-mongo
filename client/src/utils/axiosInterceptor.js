import axios from 'axios';
import authService from '../services/auth.service';

const api = axios.create({
  baseURL: 'http://localhost:3000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor para añadir el token a las solicitudes
api.interceptors.request.use(
  (config) => {
    const user = authService.getCurrentUser();
    if (user?.accessToken) {
      config.headers['x-access-token'] = user.accessToken;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Interceptor para manejar respuestas no autorizadas
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      authService.logout();
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;