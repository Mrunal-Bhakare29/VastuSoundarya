import api from './api';

export const getProjects = (params) => api.get('/projects', { params });
export const getProjectById = (id) => api.get(`/projects/${id}`);

export const getServices = (params) => api.get('/services', { params });
export const getServiceBySlug = (slug) => api.get(`/services/${slug}`);

export const getCategories = (params) => api.get('/categories', { params });
export const createCategory = (data) => api.post('/categories', data);
export const updateCategory = (id, data) => api.put(`/categories/${id}`, data);
export const deleteCategory = (id) => api.delete(`/categories/${id}`);

export const createAppointment = (data) => api.post('/appointments', data);
export const createEnquiry = (data) => api.post('/enquiries', data);

export const loginAdmin = (data) => api.post('/auth/login', data);
export const registerAdmin = (data) => api.post('/auth/register', data);
export const getMe = () => api.get('/auth/me');

export const getDashboardStats = () => api.get('/dashboard/stats');

export const createProject = (formData) =>
  api.post('/projects', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateProject = (id, formData) =>
  api.put(`/projects/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteProject = (id) => api.delete(`/projects/${id}`);
export const deleteProjectImage = (id, publicId) =>
  api.delete(`/projects/${id}/images`, { params: { publicId } });

export const createService = (formData) =>
  api.post('/services', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const updateService = (id, formData) =>
  api.put(`/services/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
export const deleteService = (id) => api.delete(`/services/${id}`);

export const getAppointments = (params) => api.get('/appointments', { params });
export const updateAppointment = (id, data) => api.put(`/appointments/${id}`, data);
export const deleteAppointment = (id) => api.delete(`/appointments/${id}`);

export const getEnquiries = (params) => api.get('/enquiries', { params });
export const updateEnquiry = (id, data) => api.put(`/enquiries/${id}`, data);
export const deleteEnquiry = (id) => api.delete(`/enquiries/${id}`);
