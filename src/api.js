import axios from 'axios';

// ⚠️ Depois que fizer o deploy do Back-end no Render (Fase 3),
// troque a linha abaixo pela URL real, ex:
// export const API_URL = 'https://api-unisenai-106.onrender.com';
export const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
});

// Injeta o token JWT automaticamente em toda requisição, quando existir
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwt_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
