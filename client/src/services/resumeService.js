import api from './api';

export const resumeService = {
  uploadResume: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.post('/resume/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 60000,
    });
    return res.data;
  },

  pasteResumeText: async (text, title) => {
    const res = await api.post('/resume/paste-text', { text, title }, { timeout: 60000 });
    return res.data;
  },

  getResume: async () => {
    const res = await api.get('/resume');
    return res.data.resume;
  },

  replaceResume: async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append('resume', file);
    const res = await api.put('/resume/replace', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      onUploadProgress,
      timeout: 60000,
    });
    return res.data;
  },

  deleteResume: async () => {
    const res = await api.delete('/resume');
    return res.data;
  },

  reanalyzeResume: async () => {
    const res = await api.post('/resume/reanalyze');
    return res.data;
  },
};
