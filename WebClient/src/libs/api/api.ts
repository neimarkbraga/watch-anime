import axios from 'axios';
import { useSessionStore } from '../../stores/useSessionStore';

export const api = axios.create({
	baseURL: process.env.REACT_APP_API_ROOT_URL || window.location.origin
});

api.interceptors.request.use((config) => {
	const { token } = useSessionStore.getState();
	if (token) config.headers['Authorization'] = `Bearer ${token}`;
	return config;
});
