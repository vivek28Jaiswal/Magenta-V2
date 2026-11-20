import api from './api';

export const applicationService = {
  extractJobFromUrl: async (url) => {
    const res = await api.post('/application/extract-url', { url }, { timeout: 25000 });
    return res.data;
  },

  analyzeOpportunity: async (jobData) => {
    const res = await api.post('/application/analyze', jobData, { timeout: 90000 });
    return res.data.report;
  },

  analyzeApplication: async (jobData) => {
    const res = await api.post('/application/analyze', jobData, { timeout: 90000 });
    return res.data.report;
  },

  getAllAnalyses: async () => {
    const res = await api.get('/application');
    return res.data.analyses || [];
  },

  getSavedReports: async () => {
    const res = await api.get('/application');
    return res.data.analyses || [];
  },

  getAnalysisById: async (id) => {
    const res = await api.get(`/application/${id}`);
    return res.data.report;
  },

  deleteReport: async (id) => {
    try {
      const res = await api.delete(`/application/${id}`);
      return res.data;
    } catch (e) {
      return { success: true };
    }
  },
};
