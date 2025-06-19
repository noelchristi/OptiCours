import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token JWT
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  institution: string;
  department?: string;
  role: 'teacher' | 'admin';
}

export interface Course {
  id: string;
  title: string;
  description?: string;
  fileType: 'pdf' | 'docx' | 'pptx';
  status: 'pending' | 'processing' | 'completed' | 'failed';
  analysis?: string;
  suggestions?: string;
  summary?: string;
  quiz?: string;
  slides?: string;
  studentNotes?: string;
  practicalWork?: string;
  createdAt: string;
  updatedAt: string;
}

// Auth
export const auth = {
  register: async (data: {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    institution: string;
    department?: string;
  }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  getProfile: async () => {
    const response = await api.get('/auth/profile');
    return response.data;
  },
};

// Courses
export const courses = {
  upload: async (file: File, title?: string, description?: string) => {
    const formData = new FormData();
    formData.append('file', file);
    if (title) formData.append('title', title);
    if (description) formData.append('description', description);

    const response = await api.post('/courses', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },

  getAll: async () => {
    const response = await api.get('/courses');
    return response.data;
  },

  getOne: async (id: string) => {
    const response = await api.get(`/courses/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/courses/${id}`);
    return response.data;
  },
};

// Export
export const exportService = {
  pdf: async (id: string) => {
    const response = await api.get(`/export/pdf/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },

  pptx: async (id: string) => {
    const response = await api.get(`/export/pptx/${id}`, {
      responseType: 'blob',
    });
    return response.data;
  },
};

export default api; 