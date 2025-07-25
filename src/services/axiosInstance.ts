import axios from 'axios';

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});

axiosInstance.interceptors.request.use(
    (config) => config,
    (error) => {
        console.error('Loi API:', error);
        return Promise.reject(error);
    }
);

export default axiosInstance;