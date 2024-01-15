import axios from 'axios';
import { sessionStore } from '../../stores/useSessionStore';

export const api = axios.create({
	baseURL: process.env.REACT_APP_API_ROOT_URL || window.location.origin
});

api.interceptors.request.use((config) => {
	config.headers['Authorization'] = `Bearer ${sessionStore.getState().token}`;
	return config;
});
