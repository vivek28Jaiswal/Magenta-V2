import api from './api';

export const jobService = {
  getRecommendations: async (params = {}) => {
    const res = await api.get('/jobs/recommendations', { params });
    return res.data;
  },

  getJobs: async (params = {}) => {
    const res = await api.get('/jobs', { params });
    return res.data;
  },

  getJobById: async (id) => {
    const res = await api.get(`/jobs/${id}`);
    return res.data;
  },

  saveJob: async (id) => {
    const res = await api.post(`/jobs/${id}/save`);
    return res.data;
  },

  unsaveJob: async (id) => {
    const res = await api.delete(`/jobs/${id}/save`);
    return res.data;
  },

  updateApplicationStatus: async (id, status, notes) => {
    const res = await api.patch(`/jobs/${id}/application-status`, { status, notes });
    return res.data;
  },

  getSavedJobs: async () => {
    const res = await api.get('/jobs/saved');
    return res.data.savedJobs;
  },

  getSourcesStatus: async () => {
    const res = await api.get('/jobs/sources/status');
    return res.data;
  },
};
