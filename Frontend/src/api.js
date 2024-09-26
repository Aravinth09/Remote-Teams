import axios from 'axios';

// Axios instance for API requests
const api = axios.create({
    baseURL: 'http://localhost:9000/api',
});

export const getUsers = async () => {
    return await api.get('/users/user');
};

// Add token to requests if available
api.interceptors.request.use(config => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, error => Promise.reject(error));

export const getTasks = (userId) => api.get(`/tasks?userId=${userId}`);
export const addTask = (taskData) => api.post('/tasks', { ...taskData, priority: taskData.priority, category: taskData.category });
export const updateTask = (taskId, updatedData) => api.put(`/tasks/${taskId}`, updatedData);
export const deleteTask = (taskId) => api.delete(`/tasks/${taskId}`);
export const loginUser = (credentials) => api.post('/users/login', credentials);
export const registerUser = (userData) => api.post('/users/register', userData);

// Download the task report
export const downloadTaskReport = async () => {
    try {
        const response = await api.get('/tasks/report', {
            responseType: 'blob',  // for downloading files
        });
        const url = window.URL.createObjectURL(new Blob([response.data]));
        const link = document.createElement('a');
        link.href = url;
        link.setAttribute('download', 'task_report.txt');
        document.body.appendChild(link);
        link.click();
    } catch (error) {
        console.error('Error downloading task report:', error);
        throw error;
    }
};


