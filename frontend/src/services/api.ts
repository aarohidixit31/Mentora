import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Base API configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Token expired or invalid
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// API Response types
interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  errors?: any[];
}

// Auth API
export const authAPI = {
  login: (credentials: { email: string; password: string }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/login', credentials),
  
  register: (userData: {
    name: string;
    email: string;
    password: string;
    role?: string;
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/register', userData),
  
  getProfile: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/auth/me'),
  
  refreshToken: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/refresh'),
  
  logout: (): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/auth/logout'),
};

// Users API
export const usersAPI = {
  getProfile: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/users/profile'),
  
  updateProfile: (userData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put('/users/profile', userData),
  
  updateTutorProfile: (tutorData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put('/users/tutor-profile', tutorData),
  
  updateFreelancerProfile: (freelancerData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put('/users/freelancer-profile', freelancerData),
  
  searchUsers: (params: {
    q: string;
    role?: string;
    page?: number;
    limit?: number;
  }): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/users/search', { params }),
  
  getLeaderboard: (limit?: number): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/users/leaderboard', { params: { limit } }),
  
  getUserById: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.get(`/users/${id}`),
  
  addXP: (points: number, reason: string): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/users/add-xp', { points, reason }),
};

// Doubts API (placeholder)
export const doubtsAPI = {
  getDoubts: (params?: any): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/doubts', { params }),
  
  createDoubt: (doubtData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/doubts', doubtData),
  
  getDoubtById: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.get(`/doubts/${id}`),
  
  updateDoubt: (id: string, doubtData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/doubts/${id}`, doubtData),
  
  deleteDoubt: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/doubts/${id}`),
};

// Mentors API (placeholder)
export const mentorsAPI = {
  getMentors: (params?: any): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/mentors', { params }),
  
  bookSession: (sessionData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/mentors/sessions', sessionData),
  
  getMentorById: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.get(`/mentors/${id}`),
  
  getMySessions: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/mentors/my-sessions'),
};

// Freelance API (placeholder)
export const freelanceAPI = {
  getProjects: (params?: any): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/freelance', { params }),
  
  createProject: (projectData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post('/freelance', projectData),
  
  getProjectById: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.get(`/freelance/${id}`),
  
  updateProject: (id: string, projectData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/freelance/${id}`, projectData),
  
  deleteProject: (id: string): Promise<AxiosResponse<ApiResponse>> =>
    api.delete(`/freelance/${id}`),
  
  applyToProject: (id: string, applicationData: any): Promise<AxiosResponse<ApiResponse>> =>
    api.post(`/freelance/${id}/apply`, applicationData),
};

// Admin API (placeholder)
export const adminAPI = {
  getUsers: (params?: any): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/admin/users', { params }),
  
  approveUser: (id: string, approved: boolean): Promise<AxiosResponse<ApiResponse>> =>
    api.put(`/admin/users/${id}/approve`, { approved }),
  
  getAnalytics: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/admin/analytics'),
  
  getReports: (params?: any): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/admin/reports', { params }),
};

// Health check
export const healthAPI = {
  check: (): Promise<AxiosResponse<ApiResponse>> =>
    api.get('/health'),
};

export default api;