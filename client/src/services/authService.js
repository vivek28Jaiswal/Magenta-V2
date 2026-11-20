import api from './api';

export const authService = {
  login: async (email, password) => {
    const res = await api.post('/auth/login', { email, password });
    if (res.data.token) {
      localStorage.setItem('magenta_token', res.data.token);
      localStorage.setItem('magenta_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  register: async (name, email, password) => {
    const res = await api.post('/auth/register', { name, email, password });
    if (res.data.token) {
      localStorage.setItem('magenta_token', res.data.token);
      localStorage.setItem('magenta_user', JSON.stringify(res.data.user));
    }
    return res.data;
  },

  getMe: async () => {
    const res = await api.get('/auth/me');
    if (res.data.user) {
      localStorage.setItem('magenta_user', JSON.stringify(res.data.user));
    }
    return res.data.user;
  },

  logout: () => {
    localStorage.removeItem('magenta_token');
    localStorage.removeItem('magenta_user');
  },
};
